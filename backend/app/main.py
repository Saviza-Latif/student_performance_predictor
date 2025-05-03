from fastapi import FastAPI, HTTPException
from app.schemas import StudentData
import pandas as pd
import joblib
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS Middleware to allow requests from React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow React frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Load the trained pipeline model
model_path = "D:/ai_project/backend/app/model/student_performance_model.pkl"
if not os.path.exists(model_path):
    raise FileNotFoundError("Model file not found. Train the model first.")
model = joblib.load(model_path)

@app.post("/predict")
def predict(data: StudentData):
    try:
        # Convert input to DataFrame
        input_df = pd.DataFrame([data.dict()])
        
        # Predict using the loaded pipeline
        prediction = model.predict(input_df)[0]
        
        return {"predicted_score": round(prediction, 2)}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {e}")
