import os

import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="Rehaish Price Estimator", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "model")
model = joblib.load(os.path.join(MODEL_DIR, "price_model.joblib"))
feature_order = joblib.load(os.path.join(MODEL_DIR, "feature_order.joblib"))


class PredictRequest(BaseModel):
    median_income: float = Field(..., gt=0, description="Median income in the area, in $10,000s (e.g. 6.5 = $65,000)")
    house_age: float = Field(..., ge=0, le=100, description="Median age of houses in the block, in years")
    avg_rooms: float = Field(..., gt=0, description="Average number of rooms per household")
    avg_bedrooms: float = Field(..., gt=0, description="Average number of bedrooms per household")
    population: float = Field(..., gt=0, description="Block population")
    avg_occupancy: float = Field(..., gt=0, description="Average household size (occupants per household)")
    latitude: float = Field(..., ge=32, le=42, description="Latitude (California range)")
    longitude: float = Field(..., ge=-125, le=-114, description="Longitude (California range)")


class PredictResponse(BaseModel):
    estimated_price_usd: float
    model: str
    dataset: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    try:
        row = [
            req.median_income,
            req.house_age,
            req.avg_rooms,
            req.avg_bedrooms,
            req.population,
            req.avg_occupancy,
            req.latitude,
            req.longitude,
        ]
        # feature_order is the exact column order the model was trained on
        prediction_100k = model.predict([row])[0]
        return PredictResponse(
            estimated_price_usd=round(float(prediction_100k) * 100_000, 2),
            model="RandomForestRegressor",
            dataset="California Housing (scikit-learn / StatLib)",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
