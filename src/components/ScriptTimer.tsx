

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { analyzeScript, getTranscriptionFeedback } from '../services/geminiService';
import { Language } from '../types';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const ScriptTimer: React.FC = () => {
  const [script, setScript] = useState('');
  const [wpm, setWpm] = useState(150);
  const [isLoading, setIsLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState('');
  const [transcriptionFeedback, setTranscriptionFeedback] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzingTranscription, setIsAnalyzingTranscription] = useState(false);
  const [language, setLanguage] = useState('en-US');

  const recognitionRef = useRef<any>(null);
  const scriptBeforeRecording = useRef('');
  const scriptRef = useRef(script);

  useEffect(() => {
    scriptRef.current = script;
  }, [script]);

  const isSpeechRecognitionSupported = useMemo(() =>
    typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window),
  []);

  useEffect(() => {
    if (!isSpeechRecognitionSupported) {
      console.warn("Speech Recognition API not supported by this browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onend = async () => {
      setIsRecording(false);
      const recordedText = scriptRef.current.replace(scriptBeforeRecording.current, '').trim();
      
      if (recordedText) {
        setIsAnalyzingTranscription(true);
        setTranscriptionFeedback('');
        const currentLanguage = language === 'vi-VN' ? Language.VI : Language.EN;
        const feedback = await getTranscriptionFeedback(recordedText, currentLanguage);
        setTranscriptionFeedback(feedback);
        setIsAnalyzingTranscription(false);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
    };
    
    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isSpeechRecognitionSupported, language]);
  
  const handleToggleRecording = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isRecording) {
      recognition.stop();
    } else {
      scriptBeforeRecording.current = script ? script.trim() + ' ' : '';
      setTranscriptionFeedback('');
      recognition.lang = language;
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        setScript(scriptBeforeRecording.current + transcript);
      };
      recognition.start();
      setIsRecording(true);
    }
  };

  const wordCount = useMemo(() => {
    return script.trim().split(/\s+/).filter(Boolean).length;
  }, [script]);

  const readingTime = useMemo(() => {
    if (wordCount === 0) return '00:00';
    const minutes = wordCount / wpm;
    const totalSeconds = Math.round(minutes * 60);
    const displayMinutes = Math.floor(totalSeconds / 60);
    const displaySeconds = totalSeconds % 60;
    return `${String(displayMinutes).padStart(2, '0')}:${String(displaySeconds).padStart(2, '0')}`;
  }, [wordCount, wpm]);

  const handleAiAnalysis = useCallback(async () => {
    if (!script.trim()) return;
    setIsLoading(true);
    setAiFeedback('');
    const currentLanguage = language === 'vi-VN' ? Language.VI : Language.EN;
    // Fix: Added the third argument `seoOptimize` with a value of false as this component doesn't have an SEO mode toggle.
    const feedback = await analyzeScript(script, currentLanguage, false);
    setAiFeedback(JSON.stringify(feedback, null, 2));
    setIsLoading(false);
  }, [script, language]);
  
  const highlightLongSentences = (text: string) => {
    const sentences = text.split(/(?<=[.?!])\s+/);
    return sentences.map((sentence, index) => {
      const words = sentence.trim().split(/\s+/).length;
      if (words > 20) {
        return <mark key={index} className="bg-yellow-500/30 rounded px-1">{sentence} </mark>;
      }
      return <span key={index}>{sentence} </span>;
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="h-full">
          <h2 className="text-2xl font-bold mb-4">Script Editor</h2>
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Paste your video script here, or use the voice-to-text feature..."
            className="w-full h-[60vh] bg-neutral-900 border border-neutral-700 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-brand-purple resize-none"
          />
        </Card>
      </div>
      <div>
        <Card className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold">Analysis & Pacing</h2>
          
          <div className="text-center">
            <p className="text-gray-400 text-sm">Estimated Reading Time</p>
            <p className="text-5xl font-bold text-brand-purple">{readingTime}</p>
            <p className="text-gray-400 text-sm mt-1">{wordCount} words</p>
          </div>
          
          <div>
            <label htmlFor="wpm-slider" className="block text-sm font-medium text-gray-300 mb-2">
              Reading Speed: <span className="font-bold text-white">{wpm} WPM</span>
            </label>
            <input
              id="wpm-slider"
              type="range"
              min="80"
              max="220"
              step="5"
              value={wpm}
              onChange={(e) => setWpm(Number(e.target.value))}
              className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-brand-purple"
            />
             <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Slow</span>
                <span>Normal</span>
                <span>Fast</span>
            </div>
          </div>

          <div>
             <h3 className="text-lg font-semibold mb-2">Long Sentence Highlighter</h3>
             <div className="max-h-40 overflow-y-auto p-3 bg-neutral-900 rounded-md border border-neutral-700 text-sm">
                {script ? highlightLongSentences(script) : <p className="text-gray-500">Your script will appear here with long sentences highlighted.</p>}
             </div>
          </div>

          {isSpeechRecognitionSupported && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Voice-to-Text</h3>
              <div className="flex flex-col gap-3 p-3 bg-neutral-900 rounded-md border border-neutral-700">
                  <label htmlFor="language-select" className="text-sm font-medium text-gray-300">Recording Language</label>
                  <select
                      id="language-select"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      disabled={isRecording}
                      className="w-full bg-neutral-700 border border-neutral-600 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple disabled:opacity-50"
                      aria-label="Select recording language"
                  >
                      <option value="en-US">English (US)</option>
                      <option value="vi-VN">Vietnamese</option>
                  </select>
                  <Button onClick={handleToggleRecording} variant={isRecording ? 'secondary' : 'primary'} className="w-full" aria-live="polite">
                      {isRecording ? (
                          <>
                              <svg className="animate-pulse h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" fill="#ef4444"></path></svg>
                              Stop Recording
                          </>
                      ) : (
                          <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                              Record Script
                          </>
                      )}
                  </Button>
              </div>
            </div>
          )}

          <div>
            <Button onClick={handleAiAnalysis} isLoading={isLoading} disabled={!script.trim() || isRecording} className="w-full">
              Improve with AI
            </Button>
            {aiFeedback && (
              <div className="mt-4 p-3 bg-neutral-900 rounded-md border border-neutral-700">
                <h4 className="font-bold mb-2 text-brand-light">AI Script Suggestions:</h4>
                <p className="text-sm whitespace-pre-wrap">{aiFeedback}</p>
              </div>
            )}
            {(isAnalyzingTranscription || transcriptionFeedback) && (
              <div className="mt-4 p-3 bg-neutral-900 rounded-md border border-neutral-700">
                <h4 className="font-bold mb-2 text-brand-light">Transcription Accuracy Feedback:</h4>
                {isAnalyzingTranscription ? (
                  <p className="text-sm text-gray-400">Analyzing transcription...</p>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{transcriptionFeedback}</p>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ScriptTimer;