from pydantic import BaseModel

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
