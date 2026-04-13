# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router
from dotenv import load_dotenv
load_dotenv()

app = FastAPI(title="Simulador Financiero API")

# Configuración CORS para permitir que Next.js hable con FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conectamos nuestras rutas
app.include_router(router, prefix="/api")

@app.get("/")
def home():
    return {"mensaje": "El motor financiero está funcionando correctamente"}