import shap
import pandas as pd
import numpy as np

def explain_prediction(model, input_df):
    explainer = shap.Explainer(model)
    shap_values = explainer(input_df)
    shap_dict = {
        feature: float(value)
        for feature, value in zip(input_df.columns, shap_values.values[0])
    }
    sorted_importance = dict(sorted(shap_dict.items(), key=lambda x: abs(x[1]), reverse=True))
    return sorted_importance
