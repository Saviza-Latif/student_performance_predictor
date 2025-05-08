import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import shap
import joblib
from fastapi.middleware.cors import CORSMiddleware

# Load the trained pipeline model
model = joblib.load("D:/ai_project/backend/app/model/student_performance_model.pkl")

# Prepare a sample input for SHAP to initialize the explainer
sample_input = pd.DataFrame([{
    "Hours_Studied": 5, "Attendance": 90, "Parental_Involvement": 5,
    "Access_to_Resources": 5, "Extracurricular_Activities": 5, "Sleep_Hours": 7,
    "Previous_Scores": 85, "Motivation_Level": 7, "Internet_Access": 1,
    "Tutoring_Sessions": 2, "Family_Income": 50, "Teacher_Quality": 7,
    "School_Type": "Public", "Peer_Influence": 6, "Physical_Activity": 4,
    "Learning_Disabilities": 0, "Parental_Education_Level": "Bachelor",
    "Distance_from_Home": 5, "Gender": "Male"
}])

# Extract RandomForest model from the pipeline
rf_model = model.named_steps["model"]

# Initialize SHAP explainer for the tree-based model
explainer = shap.TreeExplainer(rf_model)

# Define input schema using Pydantic
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

# Initialize FastAPI app
app = FastAPI()

origins = [
    "http://localhost:5173",  # Frontend (React) origin
    "http://localhost:5183",  # Add more origins if needed
    "http://localhost:57710",
    "http://localhost:57711",
]

# Add CORSMiddleware to your app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # List of allowed origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)
@app.get("/")
def root():
    return {"message": "Student performance predictor backend is running."}

@app.post("/predict")
def predict(data: StudentData):
    try:
        # Convert input to DataFrame
        input_df = pd.DataFrame([data.dict()])

        # Get prediction
        prediction = model.predict(input_df)[0]

        # Preprocess for SHAP
        preprocessed_input = model.named_steps["preprocessor"].transform(input_df)
        shap_values = explainer.shap_values(preprocessed_input)

        # Get feature names after preprocessing
        feature_names = model.named_steps["preprocessor"].get_feature_names_out()

        # Pair SHAP values with feature names
        feature_contributions = dict(zip(feature_names, shap_values[0]))
        print(f"Prediction: {prediction}")
        print(f"Feature Contributions: {feature_contributions}")
        return {
            "predicted_score": round(prediction, 2),
            "contributions": feature_contributions
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {e}")

# Run the server (for standalone use)
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
