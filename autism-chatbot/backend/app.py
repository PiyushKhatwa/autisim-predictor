from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd

app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# CORS (allows frontend to call backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the saved RandomForest model
model = joblib.load("autism_rf_model.pkl")

@app.post("/predict")
def predict(data: dict):

    # Rename A1 -> A1_Score
    mapped = {f"{k}_Score": v for k, v in data.items()}

    df = pd.DataFrame([mapped])

    prediction = model.predict(df)[0]
    return {
    "prediction": str(prediction),
    "accuracy": accuracy
}


model = joblib.load("autism_rf_model.pkl")
accuracy = 0.92   # temporarily hardcode OR compute separately

