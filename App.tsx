
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Landing } from './components/Landing';
import { LoadingAnalysis } from './components/LoadingAnalysis';
import { Chat } from './components/Chat';
import { AppState, Message, AnalysisInput, ComplexityMode, Source } from './types';
import { initializeChat, sendMessageToGemini } from './services/geminiService';
import { AlertTriangle, Heart, X } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppState>('landing');
  const [initialResponse, setInitialResponse] = useState<Message | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  
  // This would come from environment variable in a real app
  const apiKey = process.env.API_KEY; 

  const handleAnalyze = async (input: AnalysisInput) => {
    if (!apiKey) {
      alert("API Key is missing! Please ensure process.env.API_KEY is set.");
      return;
    }

    setView('analyzing');

    try {
      // Artificial delay for the "processing" feel.
      // If Auto-Research is on, the backend actually takes longer, so the delay feels real.
      const analysisPromise = initializeChat(apiKey, input);
      const minDelayPromise = new Promise(resolve => setTimeout(resolve, input.autoResearch ? 8000 : 5000));

      const [result] = await Promise.all([analysisPromise, minDelayPromise]);

      // Manually add the primary source if it's a URL
      let finalSources = result.sources;
      if (input.type === 'url') {
        try {
          const urlObj = new URL(input.value);
          const primarySource: Source = {
            title: "Primary Target Analysis",
            uri: input.value,
            domain: urlObj.hostname.replace('www.', '')
          };
          // Add to front, checking dedup
          if (!finalSources.find(s => s.uri === primarySource.uri)) {
            finalSources = [primarySource, ...finalSources];
          }
        } catch (e) {
           // Fallback if URL parsing fails
           const primarySource: Source = {
             title: "Primary Source",
             uri: input.value,
             domain: 'source'
           };
           finalSources = [primarySource, ...finalSources];
        }
      }

      setInitialResponse({
        id: 'init',
        role: 'model',
        text: result.text,
        sources: finalSources
      });
      
      setView('chat');
    } catch (error) {
      console.error(error);
      // Show the professional error modal instead of a generic alert
      setShowErrorModal(true);
      setView('landing');
    }
  };

  const handleSendMessage = async (text: string, complexity: ComplexityMode) => {
    return await sendMessageToGemini(text, complexity);
  };

  useEffect(() => {
    if (!process.env.API_KEY) {
      console.warn("Missing API KEY. App will not function correctly.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-800">
      <Header />
      
      <main className="h-full">
        {view === 'landing' && (
          <Landing onAnalyze={handleAnalyze} />
        )}

        {view === 'analyzing' && (
          <LoadingAnalysis />
        )}

        {view === 'chat' && initialResponse && (
          <Chat 
            initialMessage={initialResponse} 
            onSendMessage={handleSendMessage}
          />
        )}
      </main>

      {/* Professional Error / High Traffic Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-orange-500"></div>
            <button 
              onClick={() => setShowErrorModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <AlertTriangle className="w-8 h-8 text-rose-500" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-3">High Traffic Alert</h3>
              
              <p className="text-slate-600 mb-8 leading-relaxed text-sm">
                InsightForge is an independent project maintained by a solo developer. 
                Due to viral traffic, our servers are currently at max capacity.
                <br /><br />
                Please give us a moment to cool down and try your request again shortly.
              </p>

              <div className="space-y-3">
                <button 
                  onClick={() => setShowErrorModal(false)}
                  className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center"
                >
                  I'll Try Again Later
                </button>
                
                <a 
                  href="https://twitter.com/Rafay835113" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3.5 px-4 bg-white border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-700 hover:text-rose-600 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 group"
                >
                  <Heart className="w-4 h-4 group-hover:fill-rose-600 transition-colors" />
                  <span>Support the Developer</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
