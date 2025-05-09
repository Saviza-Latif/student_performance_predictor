import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
import joblib
import os

# Load dataset
df = pd.read_csv("D:/ai_project/backend/StudentPerformanceFactors.csv")

# Separate features and target
X = df.drop("Exam_Score", axis=1)
y = df["Exam_Score"]

# Identify column types correctly
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

# Full pipeline with model
pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("model", RandomForestRegressor(n_estimators=100, random_state=42))
])

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Fit model
pipeline.fit(X_train, y_train)

# Save model
model_path = "D:/ai_project/backend/app/model/student_performance_model.pkl"
joblib.dump(pipeline, model_path)
print(f"✅ Model saved to: {model_path}")

# ------------------------------------------------------
# Suggestion Rules (based on high performers)
# ------------------------------------------------------

high_scorers = df[df['Exam_Score'] >= 80]

# Suggestion rules for numerical and categorical values
suggestion_rules = {}

# Numerical suggestions: compute average
for col in numerical_cols:
    if col in high_scorers.columns:
        high_scorers.loc[:, col] = pd.to_numeric(high_scorers[col], errors='coerce')

        if high_scorers[col].notnull().any():
            suggestion_rules[col] = round(high_scorers[col].mean(), 2)

# Categorical suggestions: compute mode
for col in categorical_cols:
    if col in high_scorers.columns:
        mode_val = high_scorers[col].mode()
        if not mode_val.empty:
            suggestion_rules[col] = mode_val[0]

# Save suggestion rules
suggestion_path = "D:/ai_project/backend/app/model/suggestion_rules.pkl"
joblib.dump(suggestion_rules, suggestion_path)
print(f"✅ Suggestion rules saved to: {suggestion_path}")
