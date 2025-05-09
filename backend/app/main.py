import sys
sys.path.append('D:/ai_project/backend/app') 

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import shap
import joblib
from fastapi.middleware.cors import CORSMiddleware
from suggestions import generate_suggestions  # We'll align this with your suggestion file

# Load trained model
model = joblib.load("D:/ai_project/backend/app/model/student_performance_model.pkl")
rf_model = model.named_steps["model"]
explainer = shap.TreeExplainer(rf_model)

# Define input schema correctly
class StudentData(BaseModel):
    Hours_Studied: float
    Attendance: float
    Parental_Involvement: str  # Categorical
    Access_to_Resources: str   # Categorical
    Extracurricular_Activities: str  # Categorical
    Sleep_Hours: float
    Previous_Scores: float
    Motivation_Level: str
    Internet_Access: str       # Categorical
    Tutoring_Sessions: int
    Family_Income: str
    Teacher_Quality: str
    School_Type: str
    Peer_Influence: str
    Physical_Activity: float
    Learning_Disabilities: str  # Categorical
    Parental_Education_Level: str
    Distance_from_Home: str     # Categorical
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

@app.post("/predict")
def predict(data: StudentData):
    try:
        input_dict = data.dict()
        input_df = pd.DataFrame([input_dict])

        # Make prediction
        prediction = model.predict(input_df)[0]

        # SHAP explanation
        preprocessed_input = model.named_steps["preprocessor"].transform(input_df)
        shap_values = explainer.shap_values(preprocessed_input)
        feature_names = model.named_steps["preprocessor"].get_feature_names_out()
        contributions = dict(zip(feature_names, shap_values[0]))

        # Suggestions from rules
        suggestions = generate_suggestions(input_dict)

        return {
            "predicted_score": round(prediction, 2),
            "contributions": contributions,
            "suggestions": suggestions
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
