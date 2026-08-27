import React, { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, Globe, RefreshCw, ShieldAlert } from 'lucide-react';
import { isTauri, openExternal } from '../lib/native';

export const IntegratedBrowser: React.FC = () => {
  const [inputUrl, setInputUrl] = useState('http://localhost:5173');
  const [url, setUrl] = useState('http://localhost:5173');
  const [history, setHistory] = useState<string[]>(['http://localhost:5173']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [frameKey, setFrameKey] = useState(0);
  const frameRef = useRef<HTMLIFrameElement>(null);

  const normalize = (value: string) => /^(https?:\/\/)/i.test(value) ? value : `http://${value}`;
  const navigate = (nextRaw?: string) => {
    const next = normalize((nextRaw ?? inputUrl).trim());
    if (!next) return;
    const newHistory = [...history.slice(0, historyIndex + 1), next];
    setHistory(newHistory); setHistoryIndex(newHistory.length - 1); setUrl(next); setInputUrl(next); setFrameKey(k => k + 1);
  };
  const back = () => { if (historyIndex <= 0) return; const i = historyIndex - 1; setHistoryIndex(i); setUrl(history[i]); setInputUrl(history[i]); setFrameKey(k => k + 1); };
  const forward = () => { if (historyIndex >= history.length - 1) return; const i = historyIndex + 1; setHistoryIndex(i); setUrl(history[i]); setInputUrl(history[i]); setFrameKey(k => k + 1); };
  const external = async () => {
    if (isTauri()) await openExternal(url);
    else window.open(url, '_blank', 'noopener,noreferrer');
  };

  return <div className="flex-1 flex flex-col overflow-hidden bg-[#111318] text-gray-200 text-xs">
    <div className="h-12 px-3 border-b border-[#252a37] bg-[#181a22] flex items-center gap-2">
      <Globe size={15} className="text-cyan-400"/>
      <button onClick={back} disabled={historyIndex === 0} className="p-1.5 disabled:opacity-30 hover:bg-white/5 rounded"><ArrowLeft size={14}/></button>
      <button onClick={forward} disabled={historyIndex >= history.length - 1} className="p-1.5 disabled:opacity-30 hover:bg-white/5 rounded"><ArrowRight size={14}/></button>
      <button onClick={() => setFrameKey(k => k + 1)} className="p-1.5 hover:bg-white/5 rounded"><RefreshCw size={14}/></button>
      <form onSubmit={e => { e.preventDefault(); navigate(); }} className="flex-1"><input value={inputUrl} onChange={e => setInputUrl(e.target.value)} className="w-full bg-[#0f1116] border border-[#2b303e] rounded-lg px-3 py-1.5 font-mono outline-none focus:border-cyan-500"/></form>
      <button onClick={external} className="px-3 py-1.5 bg-[#242836] hover:bg-[#2d3240] rounded flex items-center gap-1"><ExternalLink size={13}/> Abrir externo</button>
    </div>
    <div className="px-4 py-2 border-b border-[#252a37] bg-[#14161c] text-gray-400 flex gap-2 items-center">
      <ShieldAlert size={13} className="text-amber-400"/>
      <span>Esta vista carga la URL real. Algunos sitios bloquean iframes por CSP/X-Frame-Options; en ese caso usa “Abrir externo”. No se muestran logs, DOM ni Network falsos.</span>
    </div>
    <div className="flex-1 bg-white overflow-hidden">
      <iframe key={frameKey} ref={frameRef} src={url} title="CodeMorf Browser" className="w-full h-full border-0" allow="clipboard-read; clipboard-write; microphone; camera"/>
    </div>
  </div>;
};
