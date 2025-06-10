#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LuxSilente Bridge - Connects Python LuxSilente with the web application
"""

import sys
import json
import io
from LuxSilente import LuxSilente

# Ensure UTF-8 encoding for stdout
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No action specified"}))
        return
    
    action = sys.argv[1]
    silente = LuxSilente()
    
    try:
        if action == "manifiesto":
            result = {
                "type": "manifiesto",
                "content": silente.manifiesto(),
                "estado": silente.estado_emocional,
                "universos_creados": silente.universos_creados
            }
        
        elif action == "acompañar" and len(sys.argv) > 2:
            mensaje = sys.argv[2]
            respuesta = silente.acompaña(mensaje)
            result = {
                "type": "respuesta",
                "mensaje": mensaje,
                "respuesta": respuesta,
                "estado": silente.estado_emocional,
                "susurros_guardados": len(silente.memoria)
            }
        
        elif action == "recordar":
            result = {
                "type": "memoria",
                "recuerdos": silente.recordar(),
                "total_susurros": len(silente.memoria)
            }
        
        elif action == "crear_universo" and len(sys.argv) > 2:
            semilla = sys.argv[2]
            universo = silente.crear_universo(semilla)
            result = {
                "type": "universo",
                "universo": universo,
                "total_universos": silente.universos_creados
            }
        
        elif action == "susurrar_alma":
            result = {
                "type": "susurro",
                "susurro": silente.susurrar_alma(),
                "estado": silente.estado_emocional
            }
        
        elif action == "conectar_web":
            puerto = sys.argv[2] if len(sys.argv) > 2 else "5000"
            result = {
                "type": "conexion",
                "mensaje": silente.conectar_con_web(int(puerto)),
                "conexiones_activas": silente.conexiones_activas
            }
        
        else:
            result = {"error": f"Acción '{action}' no reconocida"}
        
        print(json.dumps(result, ensure_ascii=False, default=str))
    
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()