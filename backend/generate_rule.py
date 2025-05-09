import joblib
import os

# Create the model directory if it doesn't exist
os.makedirs("app/model", exist_ok=True)

# Example suggestions based on your dataset features
suggestion_rules = {
    "Hours_Studied": "Try to study consistently every day.",
    "Attendance": "Maintain above 80% attendance.",
    "Parental_Involvement": "Discuss progress with parents regularly.",
    "Sleep_Hours": "Get at least 7–8 hours of sleep daily.",
    "Internet_Usage": "Avoid distractions during study time.",
    "Participation_Extra_Curricular": "Balance studies with activities."
}

# Save the file
joblib.dump(suggestion_rules, "D:/ai_project/backend/app/model/suggestion_rules.pkl")

print("✅ suggestion_rules.pkl created successfully.")
