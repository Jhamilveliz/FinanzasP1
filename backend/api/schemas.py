# api/schemas.py
from pydantic import BaseModel
from typing import List


class RunwayRequest(BaseModel):
    caja_inicial: float      # El dinero ahorrado en el banco (Ej: 150000)
    costos_fijos: float      # Sueldo de la ayudante (2300) + servicios + etc.
    ingresos_base: float     # Lo que se espera vender en un mes normal
    porcentaje_ventas: float # El slider: 60%, 80%, 100%, etc.

class RunwayResponse(BaseModel):
    ingresos_reales: float
    perdida_mensual: float
    meses_supervivencia: str # Usamos texto para poder decir "Infinita" si hay ganancias

    # Agrega esto al final de tu archivo api/schemas.py

class VanRequest(BaseModel):
    inversion_inicial: float  # Ej: -80000 (el costo del horno)
    flujo_1: float            # Ej: -25000
    flujo_2: float            # Ej: -35000
    flujo_3: float            # Ej: -45000
    tasa_descuento: float     # El slider de porcentaje (Ej: 18)

class VanResponse(BaseModel):
    van: float
    mensaje_criterio: str     # Aquí le devolveremos el texto respondiendo a la trampa

# Agrega esto al final de api/schemas.py

class DilucionRequest(BaseModel):
    inversion: float              # Ej: 200000
    valoracion_futura: float      # Lo que creen que valdrá la panadería después (Ej: 2000000)
    cap_valoracion: float         # El tope máximo negociado (El slider: 1.5M, 2M, 2.5M)
    descuento: float              # El descuento negociado (El slider: 15, 20, 25)

class DilucionResponse(BaseModel):
    porcentaje_inversor: float
    porcentaje_fundador: float
    metodo_usado: str             # Le diremos si usó "Cap" o "Descuento"
    mensaje_criterio: str


class PrestamoRequest(BaseModel):
    capital: float               # Ej: 100000
    meses: int                   # El slider de tiempo (Ej: 24 meses)
    tasa_simple_anual: float     # Ej: 15
    tasa_compuesta_anual: float  # Ej: 11

class PrestamoResponse(BaseModel):
    pago_total_simple: float
    pago_total_compuesto: float
    mensaje_criterio: str        # Le diremos al docente qué oferta aceptar

# --- ESQUEMAS PARA EL ASISTENTE (CHATBOT) ---

class ChatRequest(BaseModel):
    mensaje: str
    historial: List[MensajeHistorial] = []  # 👈 lista vacía por defecto


class ChatResponse(BaseModel):
    respuesta: str

class MensajeHistorial(BaseModel):
    role: str      # "user" o "assistant"
    content: str

