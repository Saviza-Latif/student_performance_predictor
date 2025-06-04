import sys
import os
sys.path.append('D:/ai_project/backend/app')

from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
import pandas as pd
import shap
import joblib
from fastapi.middleware.cors import CORSMiddleware
from suggestions import generate_suggestions


MODEL_DIR = "D:/ai_project/backend/app/model"
DATASET_PATH = "D:/ai_project/backend/StudentPerformanceFactors.csv"

# Load dataset
dataset = pd.read_csv(DATASET_PATH)

# Define input schema
class StudentData(BaseModel):
    Hours_Studied: float
    Attendance: float
    Parental_Involvement: str
    Access_to_Resources: str
    Extracurricular_Activities: str
    Sleep_Hours: float
    Previous_Scores: float
    Motivation_Level: str
    Internet_Access: str
    Tutoring_Sessions: int
    Family_Income: str
    Teacher_Quality: str
    School_Type: str
    Peer_Influence: str
    Physical_Activity: float
    Learning_Disabilities: str
    Parental_Education_Level: str
    Distance_from_Home: str
    Gender: str

# Setup FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
rf_data = joblib.load("app/model/student_performance_rf.pkl")
xgb_data = joblib.load("app/model/student_performance_xgb.pkl")

print("RF Metrics:", rf_data.get("metrics"))
print("XGB Metrics:", xgb_data.get("metrics"))
# Load and cache models
cached_models = {}

def load_model(model_name: str):
    if model_name not in cached_models:
        model_path = os.path.join(MODEL_DIR, f"student_performance_{model_name}.pkl")
        if not os.path.exists(model_path):
            raise HTTPException(status_code=404, detail=f"Model '{model_name}' not found.")
        cached_models[model_name] = joblib.load(model_path)
    return cached_models[model_name]

@app.get("/metrics")
def get_model_metrics(model: str = Query("rf")):
    try:
        print("Requested model for metrics:", model)
        model_data = load_model(model)
        metrics = model_data.get("metrics") if isinstance(model_data, dict) else {}
        if not metrics:
            raise HTTPException(status_code=404, detail="Metrics not found")
        return metrics
    except Exception as e:
       
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict")
def predict(data: StudentData, model: str = Query("rf")):
    try:
        input_dict = data.dict()
        input_df = pd.DataFrame([input_dict])

        loaded = load_model(model)

        if isinstance(loaded, dict) and "pipeline" in loaded:
            pipeline = loaded["pipeline"]
            metrics = loaded.get("metrics", {})
        else:
            pipeline = loaded
            metrics = {}

        prediction = pipeline.predict(input_df)[0]
        suggestions = generate_suggestions(input_dict)

        return {
            "predicted_score": float(round(prediction, 2)),
            "metrics": metrics,
            "suggestions": suggestions
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/radar-chart")
def radar_chart(data: StudentData):
    student_values = data.dict()
    top_performers = dataset[dataset["Exam_Score"] >= 80]
    avg_values = dataset.mean(numeric_only=True).to_dict()
    top_values = top_performers.mean(numeric_only=True).to_dict()

    radar_features = ['Hours_Studied', 'Attendance', 'Sleep_Hours', 'Previous_Scores', 'Tutoring_Sessions', 'Physical_Activity']

    return {
        "student_values": {k: student_values[k] for k in radar_features},
        "average_values": {k: round(avg_values[k], 2) for k in radar_features},
        "top_values": {k: round(top_values[k], 2) for k in radar_features}
    }

@app.post("/feature-importance")
def feature_importance(data: StudentData, model: str = Query("rf")):
    print("Endpoint hit: /feature-importance")
    try:
        input_df = pd.DataFrame([data.dict()])
        model_data = load_model(model)
        pipeline = model_data["pipeline"] if isinstance(model_data, dict) else model_data

        preprocessor = pipeline.named_steps["preprocessor"]
        model_instance = pipeline.named_steps["model"]
        transformed = preprocessor.transform(input_df)

        explainer = shap.Explainer(model_instance)
        shap_values = explainer(transformed)

        feature_names = preprocessor.get_feature_names_out()
        
        # Convert SHAP values to native Python float types
        importances = dict(sorted(
            zip(feature_names, [float(v) for v in shap_values[0].values]),
            key=lambda x: abs(x[1]),
            reverse=True
        ))

        print("SHAP Values:", shap_values[0].values)
        return {"feature_importance": dict(list(importances.items())[:5])}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"SHAP error: {str(e)}")
