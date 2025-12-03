import React, { useState } from 'react';
import Navbar from './frontend/components/Navbar';
import AuditInput from './frontend/components/AuditInput';
import AuditReportView from './frontend/components/AuditReportView';
import { analyzeSecurityPlan } from './backend/auditService';
import { AuditState, AuditInputData } from './types';
import { AlertCircle, FileKey, Terminal } from 'lucide-react';

const App: React.FC = () => {
  const [auditState, setAuditState] = useState<AuditState>({
    status: 'idle',
    report: null,
    error: null,
  });

  const handleAnalyze = async (data: AuditInputData) => {
    setAuditState({ status: 'analyzing', report: null, error: null });
    
    try {
      const report = await analyzeSecurityPlan(data);
      setAuditState({ status: 'complete', report, error: null });
    } catch (error: any) {
      console.error(error);
      // Mostramos el mensaje real del error lanzado por el servicio
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      setAuditState({ 
        status: 'error', 
        report: null, 
        error: errorMessage
      });
    }
  };

  const handleReset = () => {
    setAuditState({ status: 'idle', report: null, error: null });
  };

  const isApiKeyError = auditState.error?.includes("API Key") || auditState.error?.includes("403");

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {auditState.error && (
          <div className="max-w-3xl mx-auto mb-8 bg-rose-500/10 border border-rose-500/50 p-6 rounded-xl flex flex-col gap-4 text-rose-200 shadow-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-lg mb-1">Error al procesar la auditoría</p>
                <p>{auditState.error}</p>
              </div>
            </div>

            {isApiKeyError && (
              <div className="bg-slate-900/50 p-4 rounded-lg border border-rose-500/20 mt-2 text-slate-300 text-sm">
                <p className="font-semibold text-white mb-2 flex items-center gap-2">
                  <FileKey className="w-4 h-4" />
                  Cómo solucionar esto:
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Crea un archivo llamado <code className="bg-slate-800 px-1 py-0.5 rounded text-cyan-400">.env</code> en la carpeta raíz del proyecto.</li>
                  <li>
                    Abre el archivo y pega tu clave así: 
                    <div className="bg-black/50 p-2 rounded mt-1 font-mono text-xs select-all">
                      API_KEY=tu_clave_que_empieza_por_AIzaSy
                    </div>
                  </li>
                  <li className="flex items-center gap-2">
                    <Terminal className="w-3 h-3" />
                    <strong>Importante:</strong> Reinicia la terminal (<code className="bg-slate-800 px-1 rounded">Ctrl + C</code> y luego <code className="bg-slate-800 px-1 rounded">npm run dev</code>).
                  </li>
                </ol>
              </div>
            )}

            <button 
              onClick={() => setAuditState(s => ({ ...s, error: null, status: 'idle' }))}
              className="self-end text-sm hover:underline px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 rounded-lg transition-colors font-medium"
            >
              Entendido, intentar de nuevo
            </button>
          </div>
        )}

        {auditState.status === 'idle' || auditState.status === 'analyzing' ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
             <AuditInput 
               onAnalyze={handleAnalyze} 
               isAnalyzing={auditState.status === 'analyzing'} 
             />
          </div>
        ) : (
          auditState.report && (
            <AuditReportView 
              report={auditState.report} 
              onReset={handleReset} 
            />
          )
        )}
      </main>
    </div>
  );
};

export default App;