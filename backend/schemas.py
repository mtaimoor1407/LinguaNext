from pydantic import BaseModel

class PredictRequest(BaseModel):
    text: str
    language: str  # "english" or "roman_urdu"
    top_k: int = 3
    temperature: float = 1.0

class PredictResponse(BaseModel):
    predictions: list[str]
    detected_language: str
    input_text: str