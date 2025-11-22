
import React, { useState, useCallback } from 'react';
import { ArrowRight, Link as LinkIcon, FileText, Youtube, File, UploadCloud, CheckCircle, Zap, ShieldAlert, ChevronRight, Activity } from 'lucide-react';
import { Button } from './Button';
import { AnalysisInput } from '../types';

interface LandingProps {
  onAnalyze: (input: AnalysisInput) => void;
}

export const Landing: React.FC<LandingProps> = ({ onAnalyze }) => {
  const [mode, setMode] = useState<'url' | 'file'>('url');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [nuclearMode, setNuclearMode] = useState(false);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze({ 
        type: 'url', 
        value: url,
        autoResearch: nuclearMode
      });
    }
  };

  const handleFileSubmit = () => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = (e.target?.result as string).split(',')[1];
      onAnalyze({
        type: 'file',
        value: base64String,
        mimeType: file.type,
        fileName: file.name,
        autoResearch: false // No nuclear mode for files yet
      });
    };
    reader.readAsDataURL(file);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf' || droppedFile.type === 'text/plain') {
        setFile(droppedFile);
      } else {
        alert('Please upload a PDF or Text file.');
      }
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 relative overflow-hidden bg-slate-50">
      {/* Professional Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] -z-10"></div>
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-white via-white/50 to-transparent -z-10"></div>
      
      <div className="max-w-5xl w-full space-y-12 text-center z-10">
        
        {/* Hero Section */}
        <div className="space-y-6 animate-fade-in-up">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-medium tracking-wide uppercase shadow-sm mb-4">
             <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
             System Operational • v2.4
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 leading-[1.1]">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Omniscient</span> <br/>
            Research Agent.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-light">
             Drop a link. Upload a PDF. We read it, fact-check it, and find the contradictions so you don't have to.
          </p>
        </div>

        {/* Main Interface */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden transition-all duration-300">
            
            {/* Tab Switcher */}
            <div className="flex border-b border-slate-100 bg-slate-50/50">
              <button 
                onClick={() => setMode('url')}
                className={`flex-1 py-4 text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${mode === 'url' ? 'bg-white text-blue-600 border-t-2 border-t-blue-600 shadow-[0_4px_20px_-12px_rgba(37,99,235,0.2)]' : 'text-slate-500 hover:bg-white/60 hover:text-slate-700'}`}
              >
                <LinkIcon className="w-4 h-4" />
                <span>Web Resource</span>
              </button>
              <button 
                onClick={() => setMode('file')}
                className={`flex-1 py-4 text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${mode === 'file' ? 'bg-white text-blue-600 border-t-2 border-t-blue-600 shadow-[0_4px_20px_-12px_rgba(37,99,235,0.2)]' : 'text-slate-500 hover:bg-white/60 hover:text-slate-700'}`}
              >
                <FileText className="w-4 h-4" />
                <span>Document Upload</span>
              </button>
            </div>

            <div className="p-6 md:p-10 bg-white">
              {mode === 'url' ? (
                <form onSubmit={handleUrlSubmit} className="space-y-8">
                  <div className="group relative flex items-center transition-all duration-300 focus-within:scale-[1.01]">
                    <div className="absolute left-4 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                      <LinkIcon className="w-5 h-5" />
                    </div>
                    <input
                      type="url"
                      placeholder="Paste URL (YouTube, Blog, Article)..."
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl pl-12 pr-32 py-5 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner text-lg"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      autoFocus
                    />
                    <div className="absolute right-2">
                      <Button type="submit" className="px-6 py-2.5 rounded-lg text-sm" disabled={!url}>
                        Analyze
                      </Button>
                    </div>
                  </div>

                  {/* Nuclear Mode Toggle - Professional Style */}
                  <div 
                    onClick={() => setNuclearMode(!nuclearMode)}
                    className={`cursor-pointer relative overflow-hidden rounded-xl border transition-all duration-300 ${nuclearMode ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-100 hover:border-slate-200'}`}
                  >
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                         <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${nuclearMode ? 'bg-orange-100 text-orange-600' : 'bg-white text-slate-400 border border-slate-200'}`}>
                           {nuclearMode ? <Activity className="w-5 h-5 animate-pulse" /> : <ShieldAlert className="w-5 h-5" />}
                         </div>
                         <div>
                           <div className="flex items-center space-x-2">
                             <p className={`font-semibold text-sm ${nuclearMode ? 'text-orange-900' : 'text-slate-700'}`}>Auto-Research "Nuclear" Mode</p>
                             {nuclearMode && <span className="text-[10px] bg-orange-200 text-orange-800 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">Active</span>}
                           </div>
                           <p className="text-xs text-slate-500 mt-0.5">Reads target + 5 related sources to find consensus & contradictions.</p>
                         </div>
                      </div>
                      
                      <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${nuclearMode ? 'bg-orange-500' : 'bg-slate-200'}`}>
                        <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300 ${nuclearMode ? 'translate-x-6' : 'translate-x-0'}`} />
                      </div>
                    </div>
                    {nuclearMode && (
                      <div className="h-1 w-full bg-orange-100">
                        <div className="h-full bg-orange-500/30 w-full animate-pulse-slow"></div>
                      </div>
                    )}
                  </div>
                </form>
              ) : (
                <div 
                  className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer group overflow-hidden ${
                    isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={onDrop}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <input 
                    id="file-upload" 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.txt" 
                    onChange={(e) => e.target.files && setFile(e.target.files[0])} 
                  />
                  
                  {file ? (
                    <div className="flex flex-col items-center animate-fade-in relative z-10">
                      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm ring-4 ring-emerald-50">
                        <CheckCircle className="w-8 h-8" />
                      </div>
                      <p className="font-bold text-lg text-slate-900">{file.name}</p>
                      <p className="text-sm text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready to process</p>
                      <Button onClick={(e) => { e.stopPropagation(); handleFileSubmit(); }} className="mt-6 w-full max-w-xs">
                        Initialize Analysis <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center pointer-events-none relative z-10">
                      <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:bg-blue-100 group-hover:text-blue-500 ring-4 ring-slate-50 group-hover:ring-blue-50">
                        <UploadCloud className="w-8 h-8" />
                      </div>
                      <p className="font-bold text-lg text-slate-900">Upload Research Material</p>
                      <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">Drag & drop PDF research papers, contracts, or text files to begin ingestion.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Social Proof / Features */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-slate-400 text-xs font-medium uppercase tracking-widest opacity-60">
           <span className="flex items-center"><Youtube className="w-4 h-4 mr-2" /> Video Intelligence</span>
           <span className="w-1 h-1 rounded-full bg-slate-300"></span>
           <span className="flex items-center"><Activity className="w-4 h-4 mr-2" /> Deep Research</span>
           <span className="w-1 h-1 rounded-full bg-slate-300"></span>
           <span className="flex items-center"><File className="w-4 h-4 mr-2" /> PDF Citations</span>
        </div>
      </div>
    </div>
  );
};
