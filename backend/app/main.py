import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import initialize_firebase, settings
from app.routes.convert import router as convert_router

# Initialize Firebase Admin SDK
initialize_firebase()

# Create FastAPI app
app = FastAPI(
    title="3DForge API",
    description="AI-powered 2D to 3D image conversion API",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for serving generated models
if os.path.exists(settings.MODELS_DIR):
    app.mount(
        "/api/models",
        StaticFiles(directory=settings.MODELS_DIR),
        name="models",
    )

# Include API routes
app.include_router(convert_router, prefix="/api")


@app.get("/")
async def root():
    return {
        "name": "3DForge API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
    }


@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True,
    )
