# Auditoria IA 

**Auditoria IA** es una herramienta inteligente diseñada para analizar, evaluar y puntuar Planes de Seguridad Informática. Utilizando la potencia de Google Gemini, la aplicación procesa documentos (texto o PDF) y genera un informe detallado.

## Requisitos Previos

**Node.js** (Versión 18 o superior).


## Instalación y Ejecución

Sigue estos pasos exactos para correr el proyecto en tu PC:

### 1. Instalar dependencias
Abre la terminal en la carpeta del proyecto y ejecuta:
```bash
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
```
### 2. Colocar el API
Crea un archivo .env en donde coloque un API de gemini (el API se consigue mediante google cloud) y se coloca lo siguiente:
API_KEY=TU_API
### 3. Instalar las dependencias
```bash
npm install
```
### 4. Ejecutar el proyecto
```bash
npm run dev
```
Abre tu navegador en `http://localhost:5173`.
