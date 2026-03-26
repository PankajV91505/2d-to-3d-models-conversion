# 2D to 3D Image Conversion SaaS

A full-stack web application that allows users to upload 2D images and automatically generate 3D models using AI (powered by Hugging Face Spaces). This platform includes authentication, credit-based usage tracking, subscription tiers, and an interactive 3D model viewer.

## 🚀 Features

* **Authentication:** Secure user login and signup using Firebase Authentication.
* **Image to 3D Generation:** Upload a 2D image (JPG, PNG) and receive a downloadable 3D model (.glb or .obj).
* **Interactive 3D Viewer:** Preview the generated 3D models directly in the browser with zoom, pan, and rotate controls.
* **Credit System:** Users spend credits to generate 3D models.
* **Subscription Tiers:** Free, Pro, and Enterprise tiers with different credit allowances and features.
* **Responsive Dashboard:** A clean, modern UI for managing generations, viewing history, and upgrading plans.
* **Multi-Model Fallback:** The backend dynamically falls back to alternative AI models if one is overloaded.

## 🛠️ Technology Stack

**Frontend:**
* React (Vite)
* Tailwind CSS (for styling and responsiveness)
* React Three Fiber & Drei (for the 3D model viewer)
* Firebase Auth (Authentication)
* Lucide React (Icons)

**Backend:**
* Python
* FastAPI (High-performance API framework)
* Firebase Admin SDK (Firestore Database & Auth verification)
* Gradio Client (To communicate with Hugging Face AI Spaces)
* HTTPX (For downloading generated assets)

## 🏗️ Project Structure

```
3D-Image-Conversion/
├── frontend/             # React + Vite application
│   ├── src/
│   │   ├── components/   # Reusable UI components (Navbar, ModelViewer, etc.)
│   │   ├── contexts/     # React contexts (AuthContext)
│   │   ├── pages/        # Main pages (Landing, Login, Dashboard, Pricing)
│   │   └── App.jsx       # Routing and main app layout
│   └── package.json
│
└── backend/              # FastAPI Python server
    ├── app/
    │   ├── middleware/   # JWT Token verification middleware
    │   ├── routes/       # API endpoints (auth.py, convert.py, credits.py)
    │   ├── config.py     # Environment variables/configuration
    │   └── main.py       # FastAPI application entry point
    ├── requirements.txt
    └── .env              # Backend environment variables
```

## ⚙️ Local Development Setup

### 1. Prerequisites
* Node.js (v18+)
* Python (3.10+)
* A Firebase Project (with Authentication and Firestore enabled)
* A Hugging Face account (optional, but recommended for API tokens)

### 2. Firebase Configuration
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a web app and copy the config object into `frontend/.env`.
3. Go to Project Settings > Service Accounts and generate a new private key.
4. Save the downloaded JSON file as `backend/serviceAccountKey.json`.

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create an .env file based on .env.example
# Add your VITE_FIREBASE_* variables

npm run dev
```
The frontend will run on `http://localhost:5173`.

### 4. Backend Setup
```bash
cd backend
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt

# Create a .env file
# Add FIREBASE_SERVICE_ACCOUNT_KEY=serviceAccountKey.json

python -m uvicorn app.main:app --reload --port 8000
```
The backend API will run on `http://localhost:8000`.

## 🤖 Hugging Face AI Integration

This project connects to public Hugging Face Spaces via the `gradio_client` library. 
To change the primary AI model being used, update the `HF_SPACE_ID` variable in `backend/.env` (or modify `convert.py` directly). 

*Note: Free public spaces are subject to rate limits and queue times. For production, a paid API or dedicated GPU is highly recommended.*

## 📜 License

This project is licensed under the MIT License.
