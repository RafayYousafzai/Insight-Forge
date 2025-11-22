import React, { useEffect, useState } from 'react';
import { LOADING_STAGES } from '../constants';
import { Loader2 } from 'lucide-react';

export const LoadingAnalysis: React.FC = () => {
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stageInterval = setInterval(() => {
      setStageIndex((prev) => {
        if (prev >= LOADING_STAGES.length - 1) {
          clearInterval(stageInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 2000); // Change text every 2 seconds

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Random increment for realistic feel
        return Math.min(prev + Math.random() * 5, 100);
      });
    }, 200);

    return () => {
      clearInterval(stageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="w-full max-w-md p-8 space-y-8 text-center">
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          <Loader2 className="absolute inset-0 w-10 h-10 m-auto text-blue-600 animate-pulse" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900">Analyzing Content</h3>
          <div className="h-6 overflow-hidden relative">
             <p className="text-slate-500 text-sm transition-all duration-500 absolute w-full left-0 top-0">
               {LOADING_STAGES[stageIndex]}
             </p>
          </div>
        </div>

        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
