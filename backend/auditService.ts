import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AuditReport, RiskLevel, AuditInputData } from "../types";

// Define the exact JSON schema we want Gemini to return
const auditResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    overallScore: {
      type: Type.NUMBER,
      description: "A score from 0 to 100 representing the overall robustness.",
    },
    riskLevel: {
      type: Type.STRING,
      enum: [RiskLevel.CRITICAL, RiskLevel.HIGH, RiskLevel.MEDIUM, RiskLevel.LOW, RiskLevel.SAFE],
      description: "The overall calculated risk level.",
    },
    executiveSummary: {
      type: Type.STRING,
      description: "A concise executive summary in Spanish.",
    },
    complianceAlignment: {
      type: Type.STRING,
      description: "Alignment with ISO 27001/NIST/GDPR.",
    },
    detailedAnalysis: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          score: { type: Type.NUMBER },
          status: { type: Type.STRING, enum: ['Optimizado', 'Aceptable', 'Deficiente', 'Crítico'] },
          observation: { type: Type.STRING, description: "Specific finding for this category." },
        },
        required: ["category", "score", "status", "observation"],
      },
      description: "Specific analysis for Risk Analysis, Impact Analysis, Contingency Plan, and Security Policies.",
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    weaknesses: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ["Alta", "Media", "Baja"] },
        },
        required: ["title", "description", "severity"],
      },
    },
    recommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: [
    "overallScore",
    "riskLevel",
    "executiveSummary",
    "complianceAlignment",
    "detailedAnalysis",
    "strengths",
    "weaknesses",
    "recommendations",
  ],
};

export const analyzeSecurityPlan = async (input: AuditInputData): Promise<AuditReport> => {
  // Debugging logs
  console.log("Iniciando análisis...");
  
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.error("API Key is undefined");
    throw new Error("Falta la API Key. Crea un archivo .env en la raíz con API_KEY=tu_clave y reinicia la terminal.");
  }

  if (apiKey.includes("PLACEHOLDER") || apiKey.length < 10) {
     console.error("API Key is invalid placeholder");
     throw new Error("La API Key configurada no es válida. Revisa tu archivo .env");
  }

  console.log("API Key detectada correctamente (longitud: " + apiKey.length + ")");

  const ai = new GoogleGenAI({ apiKey: apiKey });

  try {
    const modelId = "gemini-2.5-flash"; 
    
    const systemPrompt = `
      Actúa como un Auditor Senior de Ciberseguridad (CISO) especializado en ISO 27001 y NIST.
      
      Tu tarea es auditar el documento proporcionado y evaluar ESPECÍFICAMENTE estos 4 pilares fundamentales:
      
      1. **Análisis de Riesgos**: ¿Identifica activos? ¿Evalúa amenazas y vulnerabilidades? ¿Calcula probabilidad e impacto?
      2. **Análisis de Impacto (BIA)**: ¿Determina la criticidad de los procesos de negocio? ¿Define RTO y RPO?
      3. **Plan de Contingencia (Continuidad)**: ¿Existen procedimientos de recuperación ante desastres? ¿Backups? ¿Roles definidos?
      4. **Políticas de Seguridad**: ¿Están definidas las reglas de juego? (Contraseñas, acceso, uso aceptable, etc.)

      Para el campo 'detailedAnalysis' del JSON, DEBES generar exactamente 4 entradas, una para cada uno de los pilares anteriores, en ese orden.
      
      Sé estricto. Si falta información en el documento, califícalo como bajo o crítico.
    `;

    let parts = [];

    if (input.type === 'pdf') {
      parts = [
        { text: systemPrompt },
        {
          inlineData: {
            mimeType: "application/pdf",
            data: input.content
          }
        }
      ];
    } else {
      parts = [
        { text: systemPrompt },
        { text: `El plan a analizar es:\n"""\n${input.content}\n"""` }
      ];
    }

    const response = await ai.models.generateContent({
      model: modelId,
      contents: { parts: parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: auditResponseSchema,
        temperature: 0.2, // Low temperature for consistent analysis
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("La IA no generó respuesta (texto vacío).");
    }

    const report: AuditReport = JSON.parse(jsonText);
    return report;

  } catch (error: any) {
    console.error("Audit Service Error Detallado:", error);
    // Extraer mensaje de error de Google si existe
    const message = error.message || "Error desconocido en el servicio de auditoría";
    if (message.includes("403")) throw new Error("Error de permisos (403): Tu API Key podría ser incorrecta o no tener acceso.");
    if (message.includes("429")) throw new Error("Límite de cuota excedido (429): Has hecho demasiadas peticiones.");
    throw new Error(message);
  }
};