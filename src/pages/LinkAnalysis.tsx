import React, { useState } from 'react';
import { Link as LinkIcon, Globe, Search, Loader2, ExternalLink, FileText } from 'lucide-react';
import ModeSelector from '../components/ModeSelector';
import AnalysisResult from '../components/AnalysisResult';
import { analyzeTextAPI } from '../services/geminiService';
import { analyzeTextOffline } from '../services/offlineEngine';
import axios from 'axios';

export default function LinkAnalysis() {
  const [url, setUrl] = useState('');
  const [mode, setMode] = useState<'API' | 'Offline'>('API');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [preview, setPreview] = useState<any>(null);

  const fetchPreview = async () => {
    if (!url) return;
    setFetching(true);
    setPreview(null);
    setResult(null);

    try {
      // In a real app, we'd use a proxy or backend to fetch the URL content
      // For this demo, we'll simulate fetching content
      await new Promise(r => setTimeout(r, 1500));
      
      const mockPreview = {
        title: "Sample Social Media Post / Article",
        description: "This is a simulated preview of the content found at the provided URL. It contains various keywords and patterns for analysis.",
        content: "The government is hiding the truth about the recent events. You won't believe what they found in the secret files. Share this before it's deleted! This is a conspiracy that mainstream media lies about.",
        type: "Article / Post",
        domain: new URL(url).hostname
      };
      
      setPreview(mockPreview);
    } catch (err) {
      console.error(err);
      alert("Could not fetch URL. Please ensure it's a valid public link.");
    } finally {
      setFetching(false);
    }
  };

  const handleAnalyze = async () => {
    if (!preview) return;
    setLoading(true);
    setResult(null);

    try {
      let analysis;
      const contentToAnalyze = `${preview.title}. ${preview.content}`;
      
      if (mode === 'API') {
        analysis = await analyzeTextAPI(contentToAnalyze);
      } else {
        analysis = analyzeTextOffline(contentToAnalyze);
      }

      const finalResult = {
        ...analysis,
        type: 'Link',
        mode,
        input: url
      };

      await axios.post('/api/analyze/save', finalResult);
      setResult(finalResult);
    } catch (err) {
      console.error(err);
      alert("Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Link Analysis</h1>
          <p className="text-slate-500">Analyze public URLs for harmful content and misinformation.</p>
        </div>
        <ModeSelector mode={mode} setMode={setMode} />
      </div>

      <div className="glass-card p-10 space-y-8">
        <div className="space-y-3">
          <label className="text-xs font-bold text-gov-navy uppercase tracking-widest flex items-center gap-2">
            <Globe className="w-4 h-4 text-gov-blue" />
            Target URL
          </label>
          <div className="flex gap-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://social-media.com/post/12345"
              className="input-field flex-1"
            />
            <button
              onClick={fetchPreview}
              disabled={fetching || !url}
              className="btn-secondary whitespace-nowrap px-8"
            >
              {fetching ? <Loader2 className="w-5 h-5 animate-spin" /> : "Fetch Content"}
            </button>
          </div>
        </div>

        {preview && (
          <div className="p-8 rounded-2xl bg-gov-bg border border-gov-border space-y-6 shadow-inner">
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gov-blue uppercase tracking-widest bg-gov-blue/10 px-2.5 py-1 rounded-lg border border-gov-blue/10">
                  {preview.type}
                </span>
                <h3 className="text-2xl font-bold text-gov-navy">{preview.title}</h3>
                <p className="text-xs text-gov-text-muted font-mono flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> {preview.domain}
                </p>
              </div>
              <div className="flex gap-2">
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-secondary py-2 px-4 text-xs flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Link
                </a>
              </div>
            </div>
            
            <p className="text-sm text-gov-text-dark leading-relaxed bg-white p-5 rounded-xl border border-gov-border shadow-sm">
              {preview.content}
            </p>

            <div className="pt-6 border-t border-gov-border">
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Link...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Analyze Extracted Content
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {result && <AnalysisResult result={result} />}
    </div>
  );
}
