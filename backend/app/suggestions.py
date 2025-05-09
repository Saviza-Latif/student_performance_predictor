# backend/app/suggestions.py

import joblib

# Load suggestion rules
suggestion_rules = joblib.load("D:/ai_project/backend/app/model/suggestion_rules.pkl")

def generate_suggestions(data: dict) -> list:
    suggestions = []

    def check_numerical(key, message):
        if key in suggestion_rules and key in data:
            try:
                if float(data[key]) < float(suggestion_rules[key]):
                    suggestions.append(message.format(suggestion_rules[key]))
            except:
                pass  # Skip if comparison fails

    def check_categorical(key, message):
        if key in suggestion_rules and key in data:
            if str(data[key]).strip().lower() != str(suggestion_rules[key]).strip().lower():
                suggestions.append(message.format(suggestion_rules[key]))

    # Numerical feature advice
    check_numerical('Sleep_Hours', "Top students sleep around {:.1f} hours. Try to sleep more.")
    check_numerical('Hours_Studied', "Top performers study about {:.1f} hours. Try to increase study time.")
    check_numerical('Attendance', "Students with attendance ≥ {:.1f}% score better. Attend more classes.")
    check_numerical('Previous_Scores', "Students with higher past scores (~{:.1f}) tend to perform better. Consider reviewing past topics.")
    check_numerical('Tutoring_Sessions', "Attending more tutoring sessions (~{:.1f}) can boost your performance.")
    check_numerical('Physical_Activity', "More physical activity (~{:.1f}) helps maintain focus and academic performance.")

    # Categorical feature advice
    check_categorical('Parental_Involvement', "High scorers often have '{}' parental involvement.")
    check_categorical('Access_to_Resources', "Consider increasing your access to '{}' for better outcomes.")
    check_categorical('Extracurricular_Activities', "Participation in '{}' extracurriculars is common among top performers.")
    check_categorical('Motivation_Level', "Boosting your motivation to '{}' level can improve performance.")
    check_categorical('Internet_Access', "Having '{}' internet access is common among high performers.")
    check_categorical('Peer_Influence', "A '{}' peer group positively impacts academic performance.")

    return suggestions
