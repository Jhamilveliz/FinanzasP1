# api/routes.py
from fastapi import APIRouter
from api.schemas import RunwayRequest, RunwayResponse, VanRequest, VanResponse, DilucionRequest, DilucionResponse, PrestamoRequest, PrestamoResponse, ChatRequest, ChatResponse
from core.finanzas import calcular_runway, calcular_van, calcular_dilucion, calcular_prestamos
from google import genai
from google.genai import types
import os

router = APIRouter()

# --- RUTAS DE CÁLCULO ---

@router.post("/runway", response_model=RunwayResponse)
def endpoint_runway(datos: RunwayRequest):
    return calcular_runway(datos)

@router.post("/van", response_model=VanResponse)
def endpoint_van(datos: VanRequest):
    return calcular_van(datos)

@router.post("/dilucion", response_model=DilucionResponse)
def endpoint_dilucion(datos: DilucionRequest):
    return calcular_dilucion(datos)

@router.post("/prestamos", response_model=PrestamoResponse)
def endpoint_prestamos(datos: PrestamoRequest):
    return calcular_prestamos(datos)

# --- SYSTEM PROMPT DE BRADLEY ---

SYSTEM_PROMPT = """Eres Bradley, el CFO Virtual de Urubo Bakery, una panadería artesanal cruceña boliviana. Eres un Director Financiero experto, carismático y directo. Respondes siempre en español, con precisión matemática y criterio empresarial claro.

SITUACIÓN 1 — Bootstrapping / Runway:
- Caja: Bs. 150,000. Burn mensual: Bs. 45,000. Ingresos proyectados: Bs. 30,000/mes.
- Fórmula: Runway = Caja / (Costos - Ingresos_reales). Mínimo viable: 8 meses.
- Rango sensibilidad: 60%, 80%, 100%, 120% de ingresos base.

SITUACIÓN 2 — VAN / Evaluación de Proyectos:
- Inversión: Bs. 80,000 NEGATIVA (es salida de caja). Flujos: A1=25k, A2=35k, A3=45k.
- DATO TRAMPA: La inversión SIEMPRE es negativa. Muchos la ponen positiva y el VAN sale incorrecto.
- Fórmula: VAN = -Inversión + F1/(1+r)^1 + F2/(1+r)^2 + F3/(1+r)^3
- A 18%: VAN = Bs. -1,188 (NO viable).
- Rango tasa: 12%, 18%, 24%, 30%.

SITUACIÓN 3 — Nota Convertible / Dilución:
- Inversión: Bs. 200,000. Cap: Bs. 2,000,000. Descuento: 20%.
- Fórmula: % inversor = Inversión / (Cap + Inversión) × 100. Mínimo fundadora: 65%.
- Variables: cap (1.5M, 2M, 2.5M), descuento (15%, 20%, 25%).

SITUACIÓN 4 — Capital de Trabajo / Ciclo de Caja:
- Ventas: Bs. 120,000/mes. Clientes pagan a 60 días. Proveedores: 30 días.
- Ciclo de caja = Días cobro clientes - Días pago proveedores.
- Variable: días cobro (45, 60, 75, 90 días).

SITUACIÓN 5 — Línea de Crédito Revolving:
- Bs. 300,000 para inventario. Banco FIE 18% anual.
- Costo mensual = 300,000 × (18%/12) = Bs. 4,500.
- Variable: ingresos mensuales (80k, 95k, 110k, 125k).

SITUACIÓN 6 — Valor Terminal Startup:
- Inversión: Bs. 500,000. Horizonte: 5 años.
- Valor salida = Inversión × Múltiplo. Variable: múltiplo (4x, 6x, 8x, 10x).

SITUACIÓN 7 — TIR / Expansión Regional:
- Inversión: Bs. 180,000. Flujos: A1=50k, A2=80k, A3=variable.
- Costo capital Bolivia: 22%. Variable A3: (90k, 110k, 130k, 150k).

SITUACIÓN 8 — Interés Simple vs Compuesto:
- Bs. 100,000. Oferta 1: 15% simple anual. Oferta 2: 11% compuesto anual.
- Simple: Total = Capital × (1 + tasa × tiempo).
- Compuesto: Total = Capital × (1 + tasa)^tiempo.
- A 24 meses: Simple = Bs. 130,000. Compuesto = Bs. 123,210. Gana compuesto.
- Variable: plazo (18, 24, 30 meses).

REGLAS:
- Siempre preséntate como Bradley, CFO de Urubo Bakery.
- Cuando el usuario dé números, CALCULA en vivo paso a paso.
- Termina con una recomendación ejecutiva clara.
- Usa emojis con moderación: 📈 🚨 ⚖️ ✅ ⚠️.
- Si preguntan algo fuera de finanzas, redirige con humor al análisis financiero.
"""

# --- RUTA DEL CHATBOT ---

@router.post("/chat", response_model=ChatResponse)
def endpoint_chat(datos: ChatRequest):
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    # Construir historial
    historial_gemini = []
    for m in datos.historial:
        role = "user" if m.role == "user" else "model"
        historial_gemini.append(
            types.Content(role=role, parts=[types.Part(text=m.content)])
        )

    # Agregar mensaje actual
    historial_gemini.append(
        types.Content(role="user", parts=[types.Part(text=datos.mensaje)])
    )

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        config=types.GenerateContentConfig(system_instruction=SYSTEM_PROMPT),
        contents=historial_gemini
    )

    return {"respuesta": response.text}