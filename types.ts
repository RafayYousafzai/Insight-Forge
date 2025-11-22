
export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
  sources?: Source[];
  displayType?: 'text' | 'action_thread' | 'action_opposing';
  timestamp?: number;
}

export interface Source {
  title: string;
  uri: string;
  domain: string;
}

export type AppState = 'landing' | 'analyzing' | 'chat';

export type ComplexityMode = 'standard' | 'eli5' | 'expert';

export interface AnalysisInput {
  type: 'url' | 'file';
  value: string; // URL or Base64 data
  mimeType?: string;
  fileName?: string;
  autoResearch?: boolean; // The "Nuclear Option"
}
