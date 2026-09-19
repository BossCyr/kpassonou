from fastapi import FastAPI
from models.schemas import AnalysisRequest, DetectionResult
from services.detector import analyze_image

app = FastAPI(
    title="Kpassonou AI Service",
    description="Service d'analyse d'images pour la détection d'inondations",
    version="0.1.0"
)


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "kpassonou-ai"}


@app.post("/analyze", response_model=DetectionResult)
def analyze(request: AnalysisRequest):
    """
    Analyse une image et retourne le niveau d'eau détecté.
    """
    result = analyze_image(
        camera_id=request.camera_id,
        image_url=request.image_url,
        location=request.location
    )
    return result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
