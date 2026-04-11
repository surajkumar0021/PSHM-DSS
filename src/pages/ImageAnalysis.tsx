import React, { useState, useRef } from 'react';
import { ImageIcon, Camera, Upload, Search, Loader2, X } from 'lucide-react';
import ModeSelector from '../components/ModeSelector';
import AnalysisResult from '../components/AnalysisResult';
import { analyzeImageAPI } from '../services/geminiService';
import { analyzeTextOffline } from '../services/offlineEngine';
import Tesseract from 'tesseract.js';
import axios from 'axios';
import { cn } from '../lib/utils';

export default function ImageAnalysis() {
  const [image, setImage] = useState<string | null>(null);
  const [mode, setMode] = useState<'API' | 'Offline'>('API');
  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [ocrText, setOcrText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        performOCR(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const performOCR = async (imageSrc: string) => {
    setOcrLoading(true);
    try {
      const { data: { text } } = await Tesseract.recognize(imageSrc, 'eng');
      setOcrText(text);
    } catch (err) {
      console.error("OCR Error:", err);
    } finally {
      setOcrLoading(false);
    }
  };

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera Error:", err);
      alert("Could not access camera.");
      setShowCamera(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setImage(dataUrl);
      performOCR(dataUrl);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null);

    try {
      let analysis;
      if (mode === 'API') {
        analysis = await analyzeImageAPI(image, ocrText);
      } else {
        analysis = analyzeTextOffline(ocrText);
      }

      const finalResult = {
        ...analysis,
        type: 'Image',
        mode,
        input: ocrText || "Image Content"
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
          <h1 className="text-3xl font-serif font-bold text-slate-900">Image Analysis</h1>
          <p className="text-slate-500">Extract text from images and analyze for harmful content.</p>
        </div>
        <ModeSelector mode={mode} setMode={setMode} />
      </div>

      <div className="glass-card p-10 space-y-8">
        {!image && !showCamera ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-5 p-16 border-2 border-dashed border-gov-border rounded-2xl hover:border-gov-blue hover:bg-blue-50/30 transition-all group"
            >
              <div className="p-5 rounded-2xl bg-gov-bg group-hover:bg-gov-blue/10 transition-colors">
                <Upload className="w-10 h-10 text-gov-text-muted group-hover:text-gov-blue" />
              </div>
              <div className="text-center">
                <p className="font-bold text-gov-navy text-lg">Upload Image</p>
                <p className="text-sm text-gov-text-muted mt-1">JPG, PNG, WEBP up to 10MB</p>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload} 
              />
            </button>

            <button 
              onClick={startCamera}
              className="flex flex-col items-center justify-center gap-5 p-16 border-2 border-dashed border-gov-border rounded-2xl hover:border-gov-blue hover:bg-blue-50/30 transition-all group"
            >
              <div className="p-5 rounded-2xl bg-gov-bg group-hover:bg-gov-blue/10 transition-colors">
                <Camera className="w-10 h-10 text-gov-text-muted group-hover:text-gov-blue" />
              </div>
              <div className="text-center">
                <p className="font-bold text-gov-navy text-lg">Capture Photo</p>
                <p className="text-sm text-gov-text-muted mt-1">Use webcam for instant analysis</p>
              </div>
            </button>
          </div>
        ) : showCamera ? (
          <div className="relative rounded-2xl overflow-hidden bg-gov-navy aspect-video shadow-2xl">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-6">
              <button 
                onClick={captureImage}
                className="btn-primary shadow-xl"
              >
                Capture Now
              </button>
              <button 
                onClick={stopCamera}
                className="btn-danger shadow-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="relative rounded-2xl overflow-hidden border border-gov-border bg-gov-bg max-h-[450px] flex justify-center shadow-inner">
              <img src={image!} alt="Preview" className="max-h-full object-contain" />
              <button 
                onClick={() => { setImage(null); setOcrText(''); setResult(null); }}
                className="absolute top-6 right-6 p-3 bg-gov-navy/80 text-white rounded-xl hover:bg-gov-navy transition-all shadow-lg backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-xs font-bold text-gov-navy uppercase tracking-widest">Extracted Text (OCR)</label>
                <div className="p-5 rounded-2xl bg-gov-bg border border-gov-border min-h-[120px] text-sm text-gov-text-dark leading-relaxed overflow-y-auto max-h-[250px] custom-scrollbar">
                  {ocrLoading ? (
                    <div className="flex items-center gap-3 text-gov-text-muted">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Extracting text content...
                    </div>
                  ) : ocrText ? (
                    ocrText
                  ) : (
                    <span className="italic text-gov-text-muted">No text detected in image.</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col justify-end">
                <button
                  onClick={handleAnalyze}
                  disabled={loading || ocrLoading}
                  className="btn-primary w-full flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Analyze Image Content
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {result && <AnalysisResult result={result} />}
    </div>
  );
}
