import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials

load_dotenv()

# Firebase Admin SDK initialization
def initialize_firebase():
    """Initialize Firebase Admin SDK with service account credentials."""
    if not firebase_admin._apps:
        service_account_path = os.getenv(
            "FIREBASE_SERVICE_ACCOUNT_KEY", "./serviceAccountKey.json"
        )
        
        if os.path.exists(service_account_path):
            cred = credentials.Certificate(service_account_path)
            firebase_admin.initialize_app(cred)
        else:
            # Try to initialize with default credentials (for cloud deployments)
            try:
                firebase_admin.initialize_app()
            except Exception as e:
                print(f"⚠️  Firebase not initialized: {e}")
                print("   Place your serviceAccountKey.json in the backend/ directory")
                print("   or set FIREBASE_SERVICE_ACCOUNT_KEY env variable")

# Configuration
class Settings:
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    HF_SPACE_ID: str = os.getenv("HF_SPACE_ID", "stabilityai/TripoSR")
    HF_TOKEN: str = os.getenv("HF_TOKEN", "")
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    UPLOAD_DIR: str = os.path.join(os.path.dirname(__file__), "..", "uploads")
    MODELS_DIR: str = os.path.join(os.path.dirname(__file__), "..", "models")

settings = Settings()

# Ensure upload and model directories exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.MODELS_DIR, exist_ok=True)
