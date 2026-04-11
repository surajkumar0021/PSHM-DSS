import React from 'react';
import { Cpu, Globe } from 'lucide-react';
import { cn } from '../lib/utils';

interface ModeSelectorProps {
  mode: 'API' | 'Offline';
  setMode: (mode: 'API' | 'Offline') => void;
}

export default function ModeSelector({ mode, setMode }: ModeSelectorProps) {
  return (
    <div className="flex p-1.5 bg-gov-bg rounded-2xl w-fit border border-gov-border shadow-inner">
      <button
        onClick={() => setMode('API')}
        className={cn(
          "flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
          mode === 'API' 
            ? "bg-white text-gov-blue shadow-md border border-gov-border" 
            : "text-gov-text-muted hover:text-gov-navy hover:bg-white/50"
        )}
      >
        <Globe className={cn("w-4 h-4", mode === 'API' ? "text-gov-blue" : "text-gov-text-muted")} />
        API / Online AI
      </button>
      <button
        onClick={() => setMode('Offline')}
        className={cn(
          "flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
          mode === 'Offline' 
            ? "bg-white text-gov-blue shadow-md border border-gov-border" 
            : "text-gov-text-muted hover:text-gov-navy hover:bg-white/50"
        )}
      >
        <Cpu className={cn("w-4 h-4", mode === 'Offline' ? "text-gov-blue" : "text-gov-text-muted")} />
        Offline ML-Based
      </button>
    </div>
  );
}
