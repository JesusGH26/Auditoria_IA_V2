export enum RiskLevel {
  CRITICAL = "CRITICO",
  HIGH = "ALTO",
  MEDIUM = "MEDIO",
  LOW = "BAJO",
  SAFE = "SEGURO"
}

export interface AuditIssue {
  title: string;
  description: string;
  severity: string;
}

export interface CategoryAnalysis {
  category: string; // "Análisis de Riesgos", "Análisis de Impacto", etc.
  score: number; // 0-100
  status: 'Optimizado' | 'Aceptable' | 'Deficiente' | 'Crítico';
  observation: string;
}

export interface AuditReport {
  overallScore: number; // 0 to 100
  riskLevel: RiskLevel;
  executiveSummary: string;
  complianceAlignment: string; // e.g., "Aligned with ISO 27001"
  detailedAnalysis: CategoryAnalysis[]; // New field for the 4 specific parameters
  strengths: string[];
  weaknesses: AuditIssue[];
  recommendations: string[];
}

export interface AuditInputData {
  type: 'text' | 'pdf';
  content: string; // Plain text or Base64 string (without data:URI prefix)
}

export interface AuditState {
  status: 'idle' | 'analyzing' | 'complete' | 'error';
  report: AuditReport | null;
  error: string | null;
}