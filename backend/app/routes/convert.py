import os
import uuid
import shutil
import tempfile
import httpx
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from firebase_admin import firestore
from gradio_client import Client, handle_file

from app.middleware.auth import verify_firebase_token
from app.config import settings

router = APIRouter()

# List of Hugging Face Spaces to try (in order of preference)
# Each entry contains: space ID, API call function, and description
HF_SPACES = [
    {
        "id": "TencentARC/Trellis-demo",
        "description": "Trellis by TencentARC (Colored meshes)",
    },
    {
        "id": "stabilityai/TripoSR",
        "description": "TripoSR by Stability AI (Colored meshes)",
    },
    {
        "id": "ashawkey/LGM",
        "description": "LGM by ashawkey (Colored meshes)",
    },
    {
        "id": "merve/daggr-image-to-3d",
        "description": "Daggr Image-to-3D (Colored meshes)",
    },
    {
        "id": "frogleo/Image-to-3D",
        "host": "https://frogleo-image-to-3d.hf.space",
        "description": "Hunyuan3D Image-to-3D (White Mesh Fallback)",
    },
]


def call_space(client, space_id, image_path, space_host=""):
    """
    Call the appropriate API based on the space ID.
    For frogleo/Image-to-3D, downloads the .glb file from static URL.
    """
    if space_id == "frogleo/Image-to-3D":
        # API: /gen_shape with image, steps, guidance_scale, seed, octree_resolution, num_chunks, target_face_num, randomize_seed
        result = client.predict(
            handle_file(image_path),  # Image
            5,                        # Inference Steps
            5.5,                      # Guidance Scale
            1234,                     # Seed
            256,                      # Octree Resolution
            8000,                     # Number of Chunks
            10000,                    # Target Face Number
            True,                     # Randomize seed
            api_name="/gen_shape",
        )
        
        # Result is a tuple: (html, {obj_dict}, glb_static_path, obj_static_path)
        # The .glb is only a static URL, not a local file — download it
        if isinstance(result, (list, tuple)) and len(result) >= 3:
            glb_static_path = result[2]  # e.g. "/static/xxx/white_mesh.glb"
            if isinstance(glb_static_path, str) and glb_static_path.endswith(".glb"):
                glb_url = f"{space_host}{glb_static_path}"
                print(f"📥 Downloading GLB from: {glb_url}")

                temp_glb = os.path.join(
                    tempfile.gettempdir(),
                    f"3dforge_{uuid.uuid4()}.glb",
                )
                try:
                    with httpx.Client(timeout=120, follow_redirects=True) as http:
                        resp = http.get(glb_url)
                        resp.raise_for_status()
                        with open(temp_glb, "wb") as f:
                            f.write(resp.content)
                    print(f"✅ GLB downloaded: {temp_glb} ({os.path.getsize(temp_glb)} bytes)")
                    return temp_glb
                except Exception as e:
                    print(f"⚠️  GLB download failed: {e}, falling back to OBJ")
                    
        return result

    elif space_id == "merve/daggr-image-to-3d":
        result = client.predict(
            handle_file(image_path),
            api_name="/predict",
        )
        return result

    else:
        # Generic fallback: try /run first, then /predict
        try:
            return client.predict(
                handle_file(image_path),
                api_name="/run",
            )
        except Exception:
            return client.predict(
                handle_file(image_path),
                api_name="/predict",
            )


def try_generate_3d(image_path: str, hf_token: str = None):
    """
    Try multiple Hugging Face Spaces to generate a 3D model.
    Returns the result and space_id from the first Space that works.
    """
    errors = []

    # If user configured a specific space, try that first
    configured_space = settings.HF_SPACE_ID
    if configured_space and configured_space not in [s["id"] for s in HF_SPACES]:
        try:
            print(f"🔄 Trying configured space: {configured_space}")
            client = Client(
                configured_space, 
                hf_token=hf_token,
                httpx_kwargs={"timeout": 600.0}
            )
            result = call_space(client, configured_space, image_path, "")
            return result, configured_space
        except Exception as e:
            errors.append(f"{configured_space}: {str(e)}")
            print(f"⚠️  {configured_space} failed: {e}")

    # Try each space in order
    for space in HF_SPACES:
        try:
            print(f"🔄 Trying: {space['description']} ({space['id']})")
            client = Client(
                space["id"], 
                hf_token=hf_token,
                httpx_kwargs={"timeout": 600.0}
            )
            result = call_space(client, space["id"], image_path, space.get("host", ""))
            print(f"✅ Success with {space['description']}")
            return result, space["id"]
        except Exception as e:
            error_msg = str(e)
            # Truncate long error messages
            if len(error_msg) > 150:
                error_msg = error_msg[:150] + "..."
            errors.append(f"{space['description']}: {error_msg}")
            print(f"⚠️  {space['description']} failed: {error_msg}")
            continue

    # All spaces failed
    # Check if failures are due to HF server overloads/timeouts
    error_summary = " | ".join(errors)
    if "10060" in error_summary or "timed out" in error_summary or "504" in error_summary:
        raise Exception(
            "The Hugging Face AI servers are currently experiencing extreme overload and are dropping connections. "
            "This is a limitation of the free public APIs. Please try again in 5-10 minutes when the global GPU queues clear."
        )

    # Standard error fallback
    short_summary = " | ".join(errors[-3:])
    raise Exception(
        f"All AI models are currently unavailable (Hugging Face servers are likely down for maintenance). Errors: {short_summary}"
    )


def find_model_file(result):
    """
    Extract the 3D model file path from the varied result formats
    returned by different Hugging Face Spaces.
    """
    if result is None:
        return None

    all_paths = []
    _collect_paths(result, all_paths)

    # Prioritize by extension: .glb > .gltf > .ply > .obj
    priority = {".glb": 0, ".gltf": 1, ".ply": 2, ".obj": 3}
    model_paths = []

    for p in all_paths:
        ext = os.path.splitext(p)[1].lower()
        if ext in priority:
            model_paths.append((priority[ext], p))

    # Also check sibling files in the same directories
    checked_dirs = set()
    for p in all_paths:
        d = os.path.dirname(p)
        if d and d not in checked_dirs and os.path.isdir(d):
            checked_dirs.add(d)
            for f in os.listdir(d):
                full = os.path.join(d, f)
                ext = os.path.splitext(f)[1].lower()
                if ext in priority and os.path.isfile(full):
                    model_paths.append((priority[ext], full))

    if model_paths:
        model_paths.sort(key=lambda x: x[0])
        return model_paths[0][1]

    # Fallback: return any existing file
    for p in all_paths:
        if os.path.isfile(p):
            return p

    return None


def _collect_paths(result, paths):
    """Recursively collect all file paths from a Gradio result."""
    if result is None:
        return

    if isinstance(result, str):
        if os.path.exists(result):
            paths.append(result)
        return

    if isinstance(result, dict):
        for key in ["value", "path", "url", "name"]:
            if key in result:
                val = result[key]
                if isinstance(val, str) and os.path.exists(val):
                    paths.append(val)
        return

    if isinstance(result, (list, tuple)):
        for item in result:
            _collect_paths(item, paths)


@router.post("/convert")
async def convert_image_to_3d(
    file: UploadFile = File(...),
    decoded_token: dict = Depends(verify_firebase_token),
):
    """
    Convert a 2D image to a 3D model.

    1. Verify user token
    2. Check user credits
    3. Send image to Hugging Face Space (tries multiple spaces)
    4. Deduct 1 credit
    5. Return the 3D model URL
    """
    uid = decoded_token["uid"]

    # 1. Check user credits in Firestore
    db = firestore.client()
    user_ref = db.collection("users").document(uid)
    user_doc = user_ref.get()

    if not user_doc.exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found. Please sign up again.",
        )

    user_data = user_doc.to_dict()
    credits = user_data.get("credits", 0)

    if credits <= 0:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough credits. Please upgrade your plan.",
        )

    # 2. Save uploaded image to temp file
    temp_dir = tempfile.mkdtemp()
    file_ext = os.path.splitext(file.filename)[1] if file.filename else ".png"
    temp_image_path = os.path.join(temp_dir, f"{uuid.uuid4()}{file_ext}")

    try:
        with open(temp_image_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        # 3. Send to Hugging Face Space via gradio_client
        try:
            hf_token = settings.HF_TOKEN if settings.HF_TOKEN else None
            result, space_used = try_generate_3d(temp_image_path, hf_token)

            print(f"📦 Result type: {type(result)}")
            print(f"📦 Result preview: {str(result)[:500]}")

            # Find the model file in the result
            model_output_path = find_model_file(result)

            if not model_output_path:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"AI model ({space_used}) returned no usable 3D file. Please try a different image.",
                )

            # 4. Copy the output model to our models directory
            ext = os.path.splitext(model_output_path)[1] or ".glb"
            model_filename = f"{uuid.uuid4()}{ext}"
            final_model_path = os.path.join(settings.MODELS_DIR, model_filename)
            shutil.copy2(model_output_path, final_model_path)

            # 5. Deduct 1 credit
            user_ref.update({"credits": firestore.Increment(-1)})

            # 6. Return the model URL
            model_url = f"/api/models/{model_filename}"

            return {
                "success": True,
                "model_url": model_url,
                "credits_remaining": credits - 1,
                "message": f"3D model generated successfully using {space_used}!",
            }

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"AI processing failed: {str(e)}",
            )

    finally:
        # Clean up temp files
        shutil.rmtree(temp_dir, ignore_errors=True)


@router.post("/upgrade")
async def upgrade_plan(
    plan: str,
    decoded_token: dict = Depends(verify_firebase_token),
):
    """
    Upgrade user plan and add credits (mock payment).
    """
    uid = decoded_token["uid"]

    plan_credits = {
        "plus": 100,
        "premium": 200,
    }

    if plan not in plan_credits:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid plan. Choose 'plus' or 'premium'.",
        )

    db = firestore.client()
    user_ref = db.collection("users").document(uid)
    user_doc = user_ref.get()

    if not user_doc.exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found.",
        )

    current_credits = user_doc.to_dict().get("credits", 0)
    new_credits = current_credits + plan_credits[plan]

    user_ref.update(
        {
            "plan": plan,
            "credits": new_credits,
        }
    )

    return {
        "success": True,
        "plan": plan,
        "credits": new_credits,
        "message": f"Upgraded to {plan.capitalize()} plan! {plan_credits[plan]} credits added.",
    }
