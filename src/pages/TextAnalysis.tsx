import React, { useState } from 'react';
import { FileText, Search, AlertCircle, Loader2 } from 'lucide-react';
import ModeSelector from '../components/ModeSelector';
import AnalysisResult from '../components/AnalysisResult';
import { analyzeTextAPI } from '../services/geminiService';
import { analyzeTextOffline } from '../services/offlineEngine';
import axios from 'axios';

export default function TextAnalysis() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<'API' | 'Offline'>('API');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      let analysis;
      if (mode === 'API') {
        analysis = await analyzeTextAPI(text);
      } else {
        analysis = analyzeTextOffline(text);
      }

      const finalResult = {
        ...analysis,
        type: 'Text',
        mode,
        input: text
      };

      // Save to history
      await axios.post('/api/analyze/save', finalResult);
      setResult(finalResult);
    } catch (err) {
      console.error(err);
      alert("Analysis failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Text Analysis</h1>
          <p className="text-slate-500">Analyze text content for harmful indicators, fake news, and toxicity.</p>
        </div>
        <ModeSelector mode={mode} setMode={setMode} />
      </div>

      <div className="glass-card p-10 space-y-8">
        <div className="space-y-3">
          <label className="text-xs font-bold text-gov-navy uppercase tracking-widest flex items-center gap-2">
            <FileText className="w-4 h-4 text-gov-blue" />
            Input Text Content
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste social media post, comment, or article text here..."
            className="input-field min-h-[200px] resize-none leading-relaxed"
          />
          <div className="flex justify-between text-[10px] font-bold text-gov-text-muted uppercase tracking-wider">
            <span>Minimum 10 characters recommended</span>
            <span>{text.length} characters</span>
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading || text.length < 10}
          className="btn-primary w-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing Content...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Perform {mode} Analysis
            </>
          )}
        </button>

        {!text && !result && (
          <div className="flex items-center gap-3 p-5 rounded-2xl bg-blue-50 border border-blue-100 text-gov-blue text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            Enter at least 10 characters to begin the analysis process.
          </div>
        )}
      </div>

      {result && <AnalysisResult result={result} />}
    </div>
  );
}
