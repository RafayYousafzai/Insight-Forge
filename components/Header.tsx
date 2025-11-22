import React from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-900">InsightForge</span>
      </div>
      
      <a 
        href="https://twitter.com/Rafay835113" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center space-x-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
      >
        <span>Built by Rafay Khan</span>
        <ExternalLink className="w-4 h-4" />
      </a>
    </header>
  );
};
