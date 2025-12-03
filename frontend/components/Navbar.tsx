import React from 'react';
import { ShieldCheck } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="w-full border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500/10 p-2 rounded-lg">
              <ShieldCheck className="h-6 w-6 text-cyan-400" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Auditoria IA
            </span>
          </div>
          <div className="text-sm text-slate-400">
            Powered by Gemini 2.5
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;