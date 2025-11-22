
import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Sparkles, Twitter, Scale, BrainCircuit, Baby, Copy, Check, Activity, Zap, ExternalLink, BookOpen } from 'lucide-react';
import { Message, Source, ComplexityMode } from '../types';
import ReactMarkdown from 'react-markdown';

interface ChatProps {
  initialMessage: Message;
  onSendMessage: (text: string, complexity: ComplexityMode) => Promise<{ text: string; sources: Source[] }>;
}

export const Chat: React.FC<ChatProps> = ({ initialMessage, onSendMessage }) => {
  const [messages, setMessages] = useState<Message[]>([{...initialMessage, timestamp: Date.now()}]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [complexity, setComplexity] = useState<ComplexityMode>('standard');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (e?: React.FormEvent, overrideText?: string, displayType?: 'action_thread' | 'action_opposing') => {
    e?.preventDefault();
    const textToSend = overrideText || input;
    
    if (!textToSend.trim() || isThinking) return;

    if (!overrideText) setInput(''); 
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      displayType: displayType || 'text',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsThinking(true);

    try {
      const response = await onSendMessage(textToSend, complexity);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
        sources: response.sources,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "⚠️ **High Traffic Warning**\n\nInsightForge is an independent project maintained by a solo developer. We are currently experiencing unusually high volume.\n\nPlease wait a few moments and try again. [Support the project](https://twitter.com/Rafay835113) to help us keep the lights on.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  // Formatter for timestamp
  const formatTime = (ts?: number) => {
    if (!ts) return '';
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 relative">
      
      {/* Professional Header */}
      <div className="absolute top-16 left-0 right-0 h-14 bg-white/80 backdrop-blur-md border-b border-slate-200 z-10 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center space-x-4 text-xs text-slate-500 font-mono">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            ONLINE
          </div>
          <div className="hidden md:block">LATENCY: 12ms</div>
          <div className="hidden md:block">MODEL: GEMINI-2.5-FLASH</div>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button 
            onClick={() => setComplexity('eli5')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${complexity === 'eli5' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <Baby className="w-3.5 h-3.5" />
            <span>ELI5</span>
          </button>
          <button 
            onClick={() => setComplexity('standard')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${complexity === 'standard' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Std</span>
          </button>
          <button 
            onClick={() => setComplexity('expert')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${complexity === 'expert' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Pro</span>
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto scroll-smooth pt-32 pb-40 px-2 md:px-0">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {messages.map((msg, idx) => (
            <div 
              key={msg.id} 
              className={`flex flex-col animate-fade-in ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* Render Special Action Messages differently */}
              {msg.role === 'user' && msg.displayType === 'action_thread' && (
                <div className="flex items-center space-x-3 text-slate-500 my-4 mx-auto w-full justify-center">
                   <div className="h-px bg-slate-200 w-12"></div>
                   <div className="flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full border border-blue-100">
                     <Twitter className="w-4 h-4 animate-pulse" />
                     <span className="text-sm font-medium">Generating Thread...</span>
                   </div>
                   <div className="h-px bg-slate-200 w-12"></div>
                </div>
              )}

              {msg.role === 'user' && msg.displayType === 'action_opposing' && (
                <div className="flex items-center space-x-3 text-slate-500 my-4 mx-auto w-full justify-center">
                   <div className="h-px bg-slate-200 w-12"></div>
                   <div className="flex items-center space-x-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full border border-orange-100">
                     <Scale className="w-4 h-4 animate-pulse" />
                     <span className="text-sm font-medium">Analyzing Counter-Arguments...</span>
                   </div>
                   <div className="h-px bg-slate-200 w-12"></div>
                </div>
              )}

              {/* Standard User Message */}
              {msg.role === 'user' && msg.displayType === 'text' && (
                <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl rounded-tr-sm max-w-[85%] shadow-lg shadow-slate-200/50">
                  <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
                </div>
              )}

              {/* Bot Message */}
              {msg.role === 'model' && (
                <div className="w-full max-w-[95%] md:max-w-full bg-white border border-slate-200 rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] overflow-hidden">
                  {/* Header of the Bot Card */}
                  <div className="bg-slate-50/50 border-b border-slate-100 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">INSIGHT ENGINE</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-[10px] font-mono text-slate-400">{formatTime(msg.timestamp)}</span>
                      <button 
                        onClick={() => handleCopy(msg.text, msg.id)}
                        className="text-slate-400 hover:text-blue-600 transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 md:p-7">
                    <div className="prose prose-sm md:prose-base prose-slate max-w-none prose-p:leading-relaxed prose-li:marker:text-blue-500">
                      <ReactMarkdown 
                        components={{
                          a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 no-underline hover:underline bg-blue-50 px-1 rounded" />
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="bg-slate-50/50 border-t border-slate-100 px-5 py-3 flex flex-wrap gap-3">
                     <button 
                       onClick={() => handleSend(undefined, "Convert the above response into a viral Twitter thread. Use hooks, threads (1/x), and emojis.", 'action_thread')}
                       className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:text-blue-500 hover:border-blue-300 hover:shadow-sm transition-all"
                     >
                       <Twitter className="w-3.5 h-3.5" />
                       <span>Make Thread</span>
                     </button>
                     <button 
                       onClick={() => handleSend(undefined, "Find credible sources that completely disagree with the above analysis. Focus on risks, downsides, and controversies. Be critical.", 'action_opposing')}
                       className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:text-orange-600 hover:border-orange-300 hover:shadow-sm transition-all"
                     >
                       <Scale className="w-3.5 h-3.5" />
                       <span>Find Opposing Views</span>
                     </button>
                  </div>

                  {/* Source Grid */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="border-t border-slate-100 bg-slate-50 p-4">
                       <div className="flex items-center space-x-2 mb-3">
                         <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Verified References & Citations</p>
                       </div>
                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {msg.sources.map((source, i) => (
                          <a 
                            key={i} 
                            href={source.uri}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center space-x-3 bg-white border border-slate-200 rounded-xl p-3 hover:border-blue-400 hover:shadow-[0_4px_12px_-6px_rgba(59,130,246,0.2)] transition-all group relative overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            {/* Favicon Thumbnail */}
                            <div className="relative">
                              <img 
                                src={`https://www.google.com/s2/favicons?sz=64&domain=${source.domain}`} 
                                alt={source.domain} 
                                className="w-8 h-8 rounded-lg bg-slate-100 object-cover border border-slate-100 shadow-sm"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://www.google.com/s2/favicons?sz=64&domain=google.com'; // Fallback
                                }}
                              />
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm text-[9px] font-bold text-slate-500">
                                {i + 1}
                              </div>
                            </div>

                            <div className="flex flex-col min-w-0 flex-1">
                              <span className="text-xs font-semibold text-slate-700 truncate group-hover:text-blue-700 transition-colors">
                                {source.title || source.domain}
                              </span>
                              <span className="text-[10px] text-slate-400 truncate flex items-center mt-0.5">
                                {source.domain} 
                                <ExternalLink className="w-2.5 h-2.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </span>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          
          {isThinking && (
            <div className="w-full max-w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm animate-pulse">
               <div className="flex items-center space-x-3 mb-4">
                 <div className="w-6 h-6 rounded bg-slate-200"></div>
                 <div className="h-4 bg-slate-200 rounded w-32"></div>
               </div>
               <div className="space-y-3">
                 <div className="h-3 bg-slate-100 rounded w-3/4"></div>
                 <div className="h-3 bg-slate-100 rounded w-full"></div>
                 <div className="h-3 bg-slate-100 rounded w-5/6"></div>
               </div>
               <div className="mt-4 flex items-center space-x-2 text-xs text-blue-600 font-medium">
                 <Zap className="w-3 h-3 animate-bounce" />
                 <span>Analyzing data points...</span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Command Bar Style */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 p-4 md:p-6 z-20">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={(e) => handleSend(e)} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your follow-up command..."
              className="relative w-full bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl pl-5 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all shadow-sm text-base font-medium"
              disabled={isThinking}
            />
            <button 
              type="submit"
              disabled={!input.trim() || isThinking}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-slate-900 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-slate-900 transition-all shadow-lg shadow-slate-900/20 hover:shadow-blue-600/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex justify-between mt-3 px-1">
             <div className="text-[10px] text-slate-400 font-mono">TOKEN LIMIT: 1M • CONTEXT: ACTIVE</div>
             <div className="text-[10px] text-slate-400 font-mono flex items-center">
               <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5"></span>
               SECURE CONNECTION
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
