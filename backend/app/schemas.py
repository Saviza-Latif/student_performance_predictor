from pydantic import BaseModel
from typing import Literal


class StudentData(BaseModel):
    Hours_Studied: float
    Attendance: float
    Parental_Involvement: Literal['Low', 'Medium', 'High']
    Access_to_Resources: Literal['Low', 'Medium', 'High']
    Extracurricular_Activities: Literal['Yes', 'No']
    Sleep_Hours: float
    Previous_Scores: float
    Motivation_Level: Literal['Low', 'Medium', 'High']
    Internet_Access: Literal['Yes', 'No']
    Tutoring_Sessions: int
    Family_Income: Literal['Low', 'Medium', 'High']
    Teacher_Quality: Literal['Low', 'Medium', 'High']
    School_Type: Literal['Public', 'Private']
    Peer_Influence: Literal['Positive', 'Neutral', 'Negative']
    Physical_Activity: float
    Learning_Disabilities: Literal['Yes', 'No']
    Parental_Education_Level: Literal['High School', 'College', 'Postgraduate']
    Distance_from_Home: Literal['Near', 'Moderate', 'Far']
    Gender: Literal['Male', 'Female']
