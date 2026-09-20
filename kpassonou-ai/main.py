from fastapi import FastAPI
from models.schemas import AnalysisRequest, DetectionResult
from services.detector import analyze_image

app = FastAPI(
    title="Kpassonou AI Service",
    description="Service d'analyse pour la détection d'inondations (Caméras + Totems)",
    version="0.2.0"
)


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "kpassonou-ai", "version": "0.2.0"}


@app.post("/analyze", response_model=DetectionResult)
def analyze(request: AnalysisRequest):
    """
    Analyse une image ou données capteur et retourne le niveau d'eau détecté.
    
    - source_type='camera' : Analyse ML d'image (qualitatif)
    - source_type='totem' : Données capteur physique (quantitatif)
    """
    result = analyze_image(
        camera_id=request.camera_id,
        image_url=request.image_url,
        location=request.location,
        source_type=request.source_type
    )
    return result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
