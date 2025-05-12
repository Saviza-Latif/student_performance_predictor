import pandas as pd
import numpy as np
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Load dataset
df = pd.read_csv("D:/ai_project/backend/StudentPerformanceFactors.csv")

# Separate features and target
X = df.drop("Exam_Score", axis=1)
y = df["Exam_Score"]

# Column types
numerical_cols = [
    'Hours_Studied', 'Attendance', 'Sleep_Hours', 'Previous_Scores',
    'Tutoring_Sessions', 'Physical_Activity'
]

categorical_cols = [
    'Parental_Involvement', 'Access_to_Resources', 'Extracurricular_Activities',
    'Motivation_Level', 'Internet_Access', 'Family_Income', 'Teacher_Quality',
    'School_Type', 'Peer_Influence', 'Learning_Disabilities',
    'Parental_Education_Level', 'Distance_from_Home', 'Gender'
]

# Preprocessing pipelines
num_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="mean")),
    ("scaler", StandardScaler())
])

cat_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("encoder", OneHotEncoder(handle_unknown="ignore"))
])

preprocessor = ColumnTransformer([
    ("num", num_pipeline, numerical_cols),
    ("cat", cat_pipeline, categorical_cols)
])

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Models dictionary
models = {
    "rf": RandomForestRegressor(n_estimators=100, random_state=42),
    "xgb": XGBRegressor(n_estimators=100, random_state=42)
}

# Directory setup
model_dir = "D:/ai_project/backend/app/model"
os.makedirs(model_dir, exist_ok=True)

for model_name, model in models.items():
    pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("model", model)
    ])
    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)

    #  calculation of RMSE
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)

    print(f"{model_name.upper()} - RMSE: {round(rmse, 2)}")

    metrics = {
        "mae": round(mean_absolute_error(y_test, y_pred), 2),
        "mse": round(mse, 2),
        "rmse": round(rmse, 2),
        "r2": round(r2_score(y_test, y_pred), 2)
    }

    model_package = {
        "pipeline": pipeline,
        "metrics": metrics
    }

    path = os.path.join(model_dir, f"student_performance_{model_name}.pkl")
    joblib.dump(model_package, path)
    # Save the model with metrics
    print(f" Saved model with metrics: {path}")

# ---------------- Suggestions ----------------
high_scorers = df[df["Exam_Score"] >= 80].copy()

#high_scorers = df[df['Exam_Score'] >= 80]
suggestion_rules = {}

for col in numerical_cols:
    if col in high_scorers.columns:
        high_scorers[col] = pd.to_numeric(high_scorers[col], errors='coerce')
        if high_scorers[col].notnull().any():
            suggestion_rules[col] = round(high_scorers[col].mean(), 2)

for col in categorical_cols:
    if col in high_scorers.columns:
        mode_val = high_scorers[col].mode()
        if not mode_val.empty:
            suggestion_rules[col] = mode_val[0]

suggestion_path = os.path.join(model_dir, "suggestion_rules.pkl")
joblib.dump(suggestion_rules, suggestion_path)
print(f" Suggestion rules saved to: {suggestion_path}")
