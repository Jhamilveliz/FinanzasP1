from api.schemas import RunwayRequest, RunwayResponse, VanRequest, VanResponse, DilucionRequest, DilucionResponse, PrestamoRequest, PrestamoResponse

def calcular_runway(datos: RunwayRequest) -> RunwayResponse:
    # 1. Calculamos cuánto entró realmente este mes
    ingresos_reales = datos.ingresos_base * (datos.porcentaje_ventas / 100)
    
    # 2. Vemos si estamos perdiendo o ganando plata
    flujo_caja = ingresos_reales - datos.costos_fijos
    
    # 3. Lógica de supervivencia
    if flujo_caja >= 0:
        # La panadería gana más de lo que gasta, no va a quebrar.
        perdida_mensual = 0.0
        meses = "Infinita (Empresa Rentable)"
    else:
        # Estamos perdiendo plata, calculamos en cuántos meses la caja llega a 0
        perdida_mensual = abs(flujo_caja)
        meses_calculados = datos.caja_inicial / perdida_mensual
        meses = str(round(meses_calculados, 1)) # Redondeamos a 1 decimal
        
    return RunwayResponse(
        ingresos_reales=ingresos_reales,
        perdida_mensual=perdida_mensual,
        meses_supervivencia=meses
    )


def calcular_van(datos: VanRequest) -> VanResponse:
    # 1. Convertimos el porcentaje a decimal (Ej: 18% -> 0.18)
    r = datos.tasa_descuento / 100.0
    
    # 2. Fórmula Matemática del VAN
    # VAN = Inversión + (Flujo1 / (1+r)^1) + (Flujo2 / (1+r)^2) + (Flujo3 / (1+r)^3)
    van = datos.inversion_inicial
    van += datos.flujo_1 / ((1 + r) ** 1)
    van += datos.flujo_2 / ((1 + r) ** 2)
    van += datos.flujo_3 / ((1 + r) ** 3)
    
    van_redondeado = round(van, 2)
    
    # 3. Lógica del "Dato Trampa" de tu docente
    # Si la inversión y los flujos son todos negativos, estamos calculando puro gasto.
    if datos.inversion_inicial < 0 and datos.flujo_1 <= 0 and datos.flujo_2 <= 0:
        mensaje = "⚠️ Dato Trampa Detectado: Todos los flujos son negativos. El VAN representa el 'Valor Actual de los Costos'. Se debe buscar el VAN menos negativo."
    elif van_redondeado >= 0:
        mensaje = "✅ Proyecto Viable. El VAN es positivo, la inversión genera valor."
    else:
        mensaje = "❌ Proyecto No Viable. El VAN es negativo, la inversión destruye valor."
        
    return VanResponse(
        van=van_redondeado,
        mensaje_criterio=mensaje
    )

def calcular_dilucion(datos: DilucionRequest) -> DilucionResponse:
    # 1. Calculamos a qué valoración entra el inversionista con el descuento
    valoracion_con_descuento = datos.valoracion_futura * (1 - (datos.descuento / 100))
    
    # 2. Lógica de la Nota Convertible (El inversionista elige lo que más le convenga, es decir, la valoración más baja)
    if datos.cap_valoracion < valoracion_con_descuento:
        valoracion_efectiva = datos.cap_valoracion
        metodo = f"Tope (Cap) de Bs. {datos.cap_valoracion:,.0f}"
    else:
        valoracion_efectiva = valoracion_con_descuento
        metodo = f"Descuento del {datos.descuento}%"
        
    # 3. Calculamos los porcentajes (Asumiendo que la mamá de tu amiga tenía el 100% antes)
    pct_inversor = (datos.inversion / valoracion_efectiva) * 100
    pct_fundador = 100 - pct_inversor
    
    # Redondeamos para que se vea bonito
    pct_inversor = round(pct_inversor, 2)
    pct_fundador = round(pct_fundador, 2)
    
    # 4. Respondemos a la Pregunta de Criterio del docente (¿Baja del 65%?)
    if pct_fundador >= 65:
        mensaje = f"✅ Trato Aceptable. La fundadora mantiene el {pct_fundador}% (mayor al 65%)."
    else:
        mensaje = f"❌ Trato Peligroso. La fundadora se diluye al {pct_fundador}% (pierde el control deseado)."
        
    return DilucionResponse(
        porcentaje_inversor=pct_inversor,
        porcentaje_fundador=pct_fundador,
        metodo_usado=metodo,
        mensaje_criterio=mensaje
    )

def calcular_prestamos(datos: PrestamoRequest) -> PrestamoResponse:
    # 1. Convertimos las tasas anuales a mensuales (en decimales)
    i_simple_mensual = (datos.tasa_simple_anual / 100) / 12
    i_compuesta_mensual = (datos.tasa_compuesta_anual / 100) / 12
    
    # 2. Fórmula Interés Simple: Capital * (1 + (tasa_mensual * n_meses))
    pago_simple = datos.capital * (1 + (i_simple_mensual * datos.meses))
    
    # 3. Fórmula Interés Compuesto: Capital * (1 + tasa_mensual)^n_meses
    pago_compuesto = datos.capital * ((1 + i_compuesta_mensual) ** datos.meses)
    
    # Redondeamos a 2 decimales
    pago_simple = round(pago_simple, 2)
    pago_compuesto = round(pago_compuesto, 2)
    
    # 4. Evaluamos cuál es la mejor oferta respondiendo al criterio del docente
    if pago_simple < pago_compuesto:
        ahorro = pago_compuesto - pago_simple
        mensaje = f"✅ Acepta la Oferta 1 (Simple al {datos.tasa_simple_anual}%). Aunque la tasa parezca mayor, ahorras Bs. {ahorro:,.2f} frente al compuesto."
    else:
        ahorro = pago_simple - pago_compuesto
        mensaje = f"✅ Acepta la Oferta 2 (Compuesto al {datos.tasa_compuesta_anual}%). Es la opción más barata. Ahorras Bs. {ahorro:,.2f}."
        
    return PrestamoResponse(
        pago_total_simple=pago_simple,
        pago_total_compuesto=pago_compuesto,
        mensaje_criterio=mensaje
    )