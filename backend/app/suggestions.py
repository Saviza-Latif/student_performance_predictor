# backend/app/suggestions.py

import joblib

suggestion_rules = joblib.load("D:/ai_project/backend/app/model/suggestion_rules.pkl")

def generate_suggestions(data: dict) -> list:
    suggestions = []

    def check_numerical(key, message):
        if key in suggestion_rules and key in data:
            if data[key] < suggestion_rules[key]:
                suggestions.append(message.format(suggestion_rules[key]))

    def check_categorical(key, message):
        if key in suggestion_rules and key in data:
            if data[key] != suggestion_rules[key]:
                suggestions.append(message.format(suggestion_rules[key]))

    # Numerical feature advice
    check_numerical('Sleep_Hours', "Top students sleep around {:.1f} hours. Try to sleep more.")
    check_numerical('Hours_Studied', "Top performers study about {:.1f} hours. Try to increase study time.")
    check_numerical('Attendance', "Students with attendance ≥ {:.1f}% score better. Attend more classes.")
    check_numerical('Access_to_Resources', "Try to access more resources. Top students score well with values around {:.1f}.")
    check_numerical('Extracurricular_Activities', "More extracurricular participation (~{:.1f}) helps balance academics.")
    check_numerical('Internet_Access', "Improved internet access (around {:.1f}) correlates with better scores.")
    check_numerical('Tutoring_Sessions', "Attending more tutoring sessions (~{:.1f}) can boost your performance.")
    check_numerical('Peer_Influence', "Positive peer influence (around {:.1f}) helps improve academic outcomes.")
    check_numerical('Physical_Activity', "More physical activity (~{:.1f}) helps maintain focus and academic performance.")

    # Categorical feature advice
    check_categorical('Parental_Involvement', "High scorers often have '{}' parental involvement.")
    check_categorical('Learning_Resources', "Consider using more '{}' to boost learning.")
    check_categorical('Motivation_Level', "Boosting your motivation to '{}' level can improve performance.")

    return suggestions
