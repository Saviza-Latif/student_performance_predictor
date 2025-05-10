from fastapi import APIRouter
from .schemas import StudentData
from typing import List
from pydantic import BaseModel
from .utils import load_model, get_shap_values, predict_exam_score, get_dataset, normalize_radar_profiles

router = APIRouter()

# Extended schema for trend comparison
class ScoreTrendInput(StudentData):
    previous_scores: List[float]

@router.post("/visualize/radar")
def radar_chart(student: StudentData):
    df = get_dataset()
    radar = normalize_radar_profiles(df, student.dict())
    return radar

@router.post("/visualize/importance")
def feature_importance(student: StudentData):
    model, encoder = load_model()
    shap_values = get_shap_values(student.dict(), model, encoder)
    return shap_values

@router.post("/visualize/trend")
def score_trend(data: ScoreTrendInput):
    model, encoder = load_model()
    predicted = predict_exam_score(data.dict(exclude={"previous_scores"}), model, encoder)
    timeline = [{"name": f"Term {i+1}", "score": s} for i, s in enumerate(data.previous_scores)]
    timeline.append({"name": "Predicted", "score": predicted})
    return {"timeline": timeline}
