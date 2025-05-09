import sys
sys.path.append('D:/ai_project/backend/app') 
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import shap
import joblib
from fastapi.middleware.cors import CORSMiddleware
from suggestions import generate_suggestions  # ✅ Use the real module



# Load model
model = joblib.load("D:/ai_project/backend/app/model/student_performance_model.pkl")
rf_model = model.named_steps["model"]
explainer = shap.TreeExplainer(rf_model)

class StudentData(BaseModel):
    Hours_Studied: float
    Attendance: float
    Parental_Involvement: float
    Access_to_Resources: float
    Extracurricular_Activities: float
    Sleep_Hours: float
    Previous_Scores: float
    Motivation_Level: float
    Internet_Access: int
    Tutoring_Sessions: int
    Family_Income: float
    Teacher_Quality: float
    School_Type: str
    Peer_Influence: float
    Physical_Activity: float
    Learning_Disabilities: int
    Parental_Education_Level: str
    Distance_from_Home: float
    Gender: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
def predict(data: StudentData):
    try:
        input_dict = data.dict()
        input_df = pd.DataFrame([input_dict])

        prediction = model.predict(input_df)[0]

        # SHAP explanation
        preprocessed_input = model.named_steps["preprocessor"].transform(input_df)
        shap_values = explainer.shap_values(preprocessed_input)
        feature_names = model.named_steps["preprocessor"].get_feature_names_out()
        contributions = dict(zip(feature_names, shap_values[0]))

        # ✅ Generate suggestions using your module
        suggestions = generate_suggestions(input_dict)

        return {
            "predicted_score": round(prediction, 2),
            "contributions": contributions,
            "suggestions": suggestions
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
