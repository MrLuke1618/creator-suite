

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { analyzeScript, getTranscriptionFeedback, optimizeContent, getThumbnailFeedback, generateThumbnails, generateImageMetadata, generateChapters, generateSingleThumbnailFromScript } from '../services/geminiService';
import { OptimizedContent, Thumbnail, Language, ScriptAnalysisFeedback, ImageMetadata, Chapter } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';
import { usePreset } from '../contexts/PresetContext';
import Teleprompter from './Teleprompter';

const downloadTextFile = (content: string, filename: string) => {
    const blob = new Blob([content], {type: 'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};


// --- START of Script Timer Logic ---
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
const ScriptEditor: React.FC<{ script: string; setScript: (s: string) => void; isBrandLockActive: boolean; }> = ({ script, setScript, isBrandLockActive }) => {
  const { t, language: currentLanguage } = useLocalization();
  const { activePreset } = usePreset();
  const [wpm, setWpm] = useState(150);
  const [isLoading, setIsLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<ScriptAnalysisFeedback | null>(null);
  const [transcriptionFeedback, setTranscriptionFeedback] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzingTranscription, setIsAnalyzingTranscription] = useState(false);
  const [recordingLanguage, setRecordingLanguage] = useState(currentLanguage === Language.VI ? 'vi-VN' : 'en-US');
  const [seoMode, setSeoMode] = useState(false);
  const [isTeleprompterOpen, setIsTeleprompterOpen] = useState(false);

  const recognitionRef = useRef<any>(null);
  const scriptBeforeRecording = useRef('');
  const scriptRef = useRef(script);
   useEffect(() => { scriptRef.current = script; }, [script]);

  const isSpeechRecognitionSupported = useMemo(() => typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window), []);

  useEffect(() => {
    if (!isSpeechRecognitionSupported) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onend = async () => {
      setIsRecording(false);
      const recordedText = scriptRef.current.replace(scriptBeforeRecording.current, '').trim();
      if (recordedText) {
        setIsAnalyzingTranscription(true);
        setIsLoading(true);
        setTranscriptionFeedback('');
        setAiFeedback(null);

        const transcriptionPromise = getTranscriptionFeedback(recordedText, currentLanguage);
        const analysisPromise = analyzeScript(scriptRef.current, currentLanguage, seoMode, activePreset.context, isBrandLockActive);

        const [transcriptionResult, analysisResult] = await Promise.all([
          transcriptionPromise,
          analysisPromise
        ]);
        
        setTranscriptionFeedback(transcriptionResult);
        setAiFeedback(analysisResult);
        
        setIsAnalyzingTranscription(false);
        setIsLoading(false);
      }
    };
    recognition.onerror = (event: any) => { setIsRecording(false); console.error("Speech recognition error", event.error); };
    recognitionRef.current = recognition;
    return () => { if (recognitionRef.current) recognitionRef.current.stop(); };
  }, [isSpeechRecognitionSupported, currentLanguage, seoMode, activePreset.context, isBrandLockActive]);
  
  const handleToggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      scriptBeforeRecording.current = script ? script.trim() + ' ' : '';
      setTranscriptionFeedback('');
      setAiFeedback(null);
      recognitionRef.current.lang = recordingLanguage;
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results).map((r: any) => r[0].transcript).join('');
        setScript(scriptBeforeRecording.current + transcript);
      };
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const wordCount = useMemo(() => script.trim().split(/\s+/).filter(Boolean).length, [script]);
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
    setAiFeedback(null);
    const feedback = await analyzeScript(script, currentLanguage, seoMode, activePreset.context, isBrandLockActive);
    setAiFeedback(feedback);
    setIsLoading(false);
  }, [script, currentLanguage, seoMode, activePreset.context, isBrandLockActive]);

  const handleExportScript = () => {
    downloadTextFile(script, 'video_script.txt');
  };

  return (
    <>
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <Card className="flex flex-col flex-grow">
          <h3 className="text-xl font-bold mb-4">{t('productionStudio.scriptEditor')}</h3>
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder={t('productionStudio.scriptPlaceholder')}
            className="w-full flex-grow bg-neutral-900 border border-neutral-700 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-brand-purple resize-none min-h-[50vh]"
          />
        </Card>
        {(isAnalyzingTranscription || transcriptionFeedback) && (
          <Card>
            <h3 className="text-xl font-bold mb-2 text-brand-light">{t('productionStudio.transcriptionFeedback')}</h3>
            {isAnalyzingTranscription ? (
              <p className="text-sm text-gray-400">{t('productionStudio.analyzingTranscription')}</p>
            ) : (
              <p className="text-sm whitespace-pre-wrap">{transcriptionFeedback}</p>
            )}
          </Card>
        )}
        {(isLoading && !isAnalyzingTranscription) && (
             <Card>
                <p className="text-sm text-gray-400">{t('productionStudio.analyzingScript')}</p>
            </Card>
        )}
        {aiFeedback && (
            <Card>
                <h3 className="text-xl font-bold mb-4 text-brand-light">{t('productionStudio.aiScriptAnalysis')}</h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-lg mb-2">{t('productionStudio.overallFeedback')}</h4>
                        <p className="text-sm p-3 bg-neutral-900 rounded-md">{aiFeedback.overallFeedback}</p>
                    </div>
                    {aiFeedback.rephrasingSuggestions?.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-lg mb-2">{t('productionStudio.rephrasingSuggestions')}</h4>
                            <div className="space-y-2 text-sm">
                                {aiFeedback.rephrasingSuggestions.map((s, i) => (
                                    <div key={i} className="p-3 bg-neutral-900 rounded-md">
                                        <p><span className="font-bold text-gray-400">Original:</span> "{s.original}"</p>
                                        <p><span className="font-bold text-green-400">Suggestion:</span> "{s.suggestion}"</p>
                                        <p className="text-xs text-gray-500 mt-1">Reason: {s.reason}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                     {aiFeedback.ctaSuggestions?.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-lg mb-2">{t('productionStudio.ctaSuggestions')}</h4>
                             <ul className="list-disc list-inside text-sm p-3 bg-neutral-900 rounded-md">
                                {aiFeedback.ctaSuggestions.map((cta, i) => <li key={i}>{cta}</li>)}
                            </ul>
                        </div>
                    )}
                </div>
            </Card>
        )}
        {aiFeedback?.rewrittenScript && (
             <Card>
                <h3 className="text-xl font-bold mb-4 text-brand-light">{t('productionStudio.rewrittenScriptTitle')}</h3>
                <textarea
                    readOnly
                    value={aiFeedback.rewrittenScript}
                    rows={15}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-brand-purple resize-y"
                />
                <Button onClick={() => setScript(aiFeedback.rewrittenScript)} className="mt-4">{t('productionStudio.useThisVersion')}</Button>
             </Card>
        )}
      </div>
      <div className="sticky top-24">
        <Card className="flex flex-col gap-6">
          <h3 className="text-xl font-bold">{t('productionStudio.analysisAndPacing')}</h3>
          <div className="text-center p-4 bg-neutral-900 rounded-md">
            <p className="text-gray-400 text-sm">{t('productionStudio.readingTime')}</p>
            <p className="text-5xl font-bold text-brand-purple">{readingTime}</p>
            <p className="text-gray-400 text-sm mt-1">{wordCount} {t('productionStudio.words')}</p>
          </div>
          <div>
            <label htmlFor="wpm-slider" className="block text-sm font-medium text-gray-300 mb-2">{t('productionStudio.readingSpeed')}: <span className="font-bold text-white">{wpm} {t('productionStudio.wpm')}</span></label>
            <input id="wpm-slider" type="range" min="80" max="220" step="5" value={wpm} onChange={(e) => setWpm(Number(e.target.value))} className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-brand-purple"/>
          </div>
          {isSpeechRecognitionSupported && (
            <div>
              <h4 className="text-lg font-semibold mb-2">{t('productionStudio.voiceToText')}</h4>
              <div className="flex flex-col gap-3 p-3 bg-neutral-900 rounded-md border border-neutral-700">
                  <select value={recordingLanguage} onChange={(e) => setRecordingLanguage(e.target.value)} disabled={isRecording} className="w-full bg-neutral-700 border border-neutral-600 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple disabled:opacity-50" aria-label="Select recording language">
                      <option value="en-US">{t('productionStudio.english')}</option><option value="vi-VN">{t('productionStudio.vietnamese')}</option>
                  </select>
                  <Button onClick={handleToggleRecording} variant={isRecording ? 'secondary' : 'primary'} className="w-full" aria-live="polite">
                    {isRecording ? (
                        <>
                          <svg className="animate-pulse h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" fill="#ef4444"></path></svg>
                          {t('productionStudio.stopRecording')}
                        </>
                    ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                          {t('productionStudio.recordScript')}
                        </>
                    )}
                  </Button>
              </div>
            </div>
          )}
          <div className="p-3 bg-neutral-900 rounded-md border border-neutral-700 space-y-2">
            <label htmlFor="seo-mode-toggle" className="flex items-center justify-between cursor-pointer">
                <span className="font-semibold text-brand-light">{t('productionStudio.seoMode')}</span>
                <div className="relative">
                    <input type="checkbox" id="seo-mode-toggle" className="sr-only" checked={seoMode} onChange={() => setSeoMode(!seoMode)} />
                    <div className={`block w-10 h-5 rounded-full transition-colors ${seoMode ? 'bg-brand-purple' : 'bg-neutral-600'}`}></div>
                    <div className={`dot absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${seoMode ? 'transform translate-x-full' : ''}`}></div>
                </div>
            </label>
            <p className="text-xs text-gray-400">{t('productionStudio.seoModeDescription')}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={handleAiAnalysis} isLoading={isLoading && !isAnalyzingTranscription} disabled={!script.trim() || isRecording} className="w-full">{t('productionStudio.improveScript')}</Button>
            <Button onClick={() => setIsTeleprompterOpen(true)} variant="secondary" disabled={!script.trim()} className="w-full">{t('productionStudio.teleprompter')}</Button>
            <Button onClick={handleExportScript} variant="secondary" disabled={!script.trim()} className="w-full">{t('productionStudio.exportScript')}</Button>
          </div>
        </Card>
      </div>
    </div>
     {isTeleprompterOpen && <Teleprompter script={script} onClose={() => setIsTeleprompterOpen(false)} />}
    </>
  );
}
// --- END of Script Timer Logic ---


// --- START of Optimizer Logic ---
const Optimizer: React.FC<{ script: string; setGeneratedTitle: (t: string) => void; isBrandLockActive: boolean; }> = ({ script, setGeneratedTitle, isBrandLockActive }) => {
  const { t, language } = useLocalization();
  const { activePreset } = usePreset();
  const [optimizedContent, setOptimizedContent] = useState<OptimizedContent | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isGeneratingChapters, setIsGeneratingChapters] = useState(false);


  const handleOptimization = useCallback(async () => {
    if (!script.trim()) return;
    setIsOptimizing(true);
    setOptimizedContent(null);
    const result = await optimizeContent(script, language, activePreset.context, isBrandLockActive);
    setOptimizedContent(result);
    if(result.titles.length > 0) {
        setGeneratedTitle(result.titles[0]);
    }
    setIsOptimizing(false);
  }, [script, language, setGeneratedTitle, activePreset.context, isBrandLockActive]);

  const handleGenerateChapters = useCallback(async () => {
    if (!script.trim()) return;
    setIsGeneratingChapters(true);
    setChapters([]);
    const result = await generateChapters(script, language, activePreset.context, isBrandLockActive);
    setChapters(result);
    setIsGeneratingChapters(false);
  }, [script, language, activePreset.context, isBrandLockActive]);

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

  const copyChaptersForYouTube = () => {
    const chapterText = chapters.map(ch => `${ch.timestamp} ${ch.title}`).join('\n');
    copyToClipboard(chapterText);
  };

  const handleExportMetadata = () => {
    if (!optimizedContent) return;
    let content = `--- VIDEO METADATA REPORT ---\n\n`;
    content += `## SUGGESTED TITLES:\n`;
    content += optimizedContent.titles.map(title => `- ${title}`).join('\n');
    content += `\n\n## VIDEO DESCRIPTION:\n${optimizedContent.description}\n`;
    content += `\n\n## TAGS:\n${optimizedContent.tags.join(', ')}\n`;
    if (chapters.length > 0) {
        content += `\n\n## CHAPTERS:\n`;
        content += chapters.map(ch => `${ch.timestamp} ${ch.title}`).join('\n');
    }
    downloadTextFile(content, 'video_metadata.txt');
  };

  if(!script.trim()){
      return <div className="text-center py-12 text-gray-500">{t('productionStudio.optimizerPrompt')}</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
            <h3 className="text-xl font-bold">{t('productionStudio.metadataGeneration')}</h3>
            <div className="flex gap-2">
                <Button onClick={handleOptimization} isLoading={isOptimizing} disabled={!script.trim()}>{t('productionStudio.generateMetadata')}</Button>
                <Button variant="secondary" onClick={handleExportMetadata} disabled={!optimizedContent}>{t('productionStudio.exportMetadata')}</Button>
            </div>
        </div>
        <div className="mt-6">
        {isOptimizing && <p className="text-gray-400">{t('productionStudio.optimizing')}...</p>}
        {optimizedContent ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-brand-light">{t('productionStudio.suggestedTitles')}</h3>
              <ul className="space-y-2">{optimizedContent.titles.map((title, index) => <li key={index} className="flex items-center justify-between p-2 bg-neutral-900 rounded-md text-sm"><span>{title}</span><button onClick={() => copyToClipboard(title)} className="text-gray-400 hover:text-white" title={t('productionStudio.copy')}><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button></li>)}</ul>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-brand-light">{t('productionStudio.videoDescription')}</h3>
                <div className="p-3 bg-neutral-900 rounded-md text-sm whitespace-pre-wrap relative"><p>{optimizedContent.description}</p><button onClick={() => copyToClipboard(optimizedContent.description)} className="absolute top-2 right-2 text-gray-400 hover:text-white" title={t('productionStudio.copy')}><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button></div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-brand-light">{t('productionStudio.tags')}</h3>
                <div className="flex flex-wrap gap-2">{optimizedContent.tags.map((tag, index) => <span key={index} className="px-2 py-1 bg-neutral-700 text-xs rounded-md">{tag}</span>)}</div>
              </div>
            </div>
          </div>
        ) : <div className="text-center text-gray-500 py-8"><p>{t('productionStudio.optimizedContentPlaceholder')}</p></div>}
        </div>
      </Card>
      
      <Card>
        <h3 className="text-xl font-bold mb-4">{t('productionStudio.chapterGeneratorTitle')}</h3>
        <p className="text-gray-400 text-sm mb-4">{t('productionStudio.chapterGeneratorDescription')}</p>
        <Button onClick={handleGenerateChapters} isLoading={isGeneratingChapters} disabled={!script.trim()}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          {t('productionStudio.generateChapters')}
        </Button>
        <div className="mt-4">
            {isGeneratingChapters && <p className="text-gray-400">{t('productionStudio.generatingChapters')}...</p>}
            {chapters.length > 0 && (
                 <div className="p-4 bg-neutral-900 rounded-md">
                     <div className="flex justify-end mb-2">
                        <Button onClick={copyChaptersForYouTube} size="sm" variant="secondary">{t('productionStudio.copyForYouTube')}</Button>
                     </div>
                    <ul className="space-y-1">
                        {chapters.map((chapter, index) => (
                            <li key={index} className="flex items-center gap-4 text-sm p-1 rounded">
                                <span className="font-mono text-gray-400">{chapter.timestamp}</span>
                                <span>{chapter.title}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
      </Card>
    </div>
  );
}
// --- END of Optimizer Logic ---


// --- START of Thumbnail Tester Logic ---
const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => { const reader = new FileReader(); reader.readAsDataURL(file); reader.onload = () => resolve((reader.result as string).split(',')[1]); reader.onerror = error => reject(error); });
const ThumbnailUpload: React.FC<{ onUpload: (t: Thumbnail) => void, id: string, label: string }> = ({ onUpload, id, label }) => {
  const { t } = useLocalization();
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      onUpload({ name: file.name, dataUrl: URL.createObjectURL(file), base64 });
    }
  };
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-600 border-dashed rounded-md"><div className="space-y-1 text-center"><svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg><div className="flex text-sm text-gray-500"><label htmlFor={id} className="relative cursor-pointer bg-neutral-800 rounded-md font-medium text-brand-purple hover:text-violet-400 focus-within:outline-none"><span>{t('productionStudio.uploadFile')}</span><input id={id} name={id} type="file" className="sr-only" accept="image/png, image/jpeg" onChange={handleFileChange} /></label><p className="pl-1">{t('productionStudio.dragDrop')}</p></div><p className="text-xs text-gray-500">{t('productionStudio.pngJpg')}</p></div></div>
    </div>
  );
};
const ThumbnailPreview: React.FC<{ thumbnail: Thumbnail | null }> = ({ thumbnail }) => {
    const { t } = useLocalization();
    return <div className="bg-neutral-900 aspect-video rounded-lg overflow-hidden relative flex items-center justify-center border border-neutral-700">{thumbnail ? <img src={thumbnail.dataUrl} alt={thumbnail.name} className="object-contain w-full h-full" /> : <p className="text-gray-500">{t('productionStudio.noImage')}</p>}</div>
};
const ThumbnailStudio: React.FC<{ generatedTitle: string; script: string, contentType: '16:9' | '9:16'; isBrandLockActive: boolean; }> = ({ generatedTitle, script, contentType, isBrandLockActive }) => {
  const { t, language } = useLocalization();
  const { activePreset } = usePreset();
  const [thumbA, setThumbA] = useState<Thumbnail | null>(null);
  const [thumbB, setThumbB] = useState<Thumbnail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [generatedThumbs, setGeneratedThumbs] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const [metadataThumb, setMetadataThumb] = useState<Thumbnail | null>(null);
  const [isGeneratingMetadata, setIsGeneratingMetadata] = useState(false);
  const [metadataResult, setMetadataResult] = useState<ImageMetadata | null>(null);

  const [scriptGeneratedThumb, setScriptGeneratedThumb] = useState<string | null>(null);
  const [isGeneratingFromScript, setIsGeneratingFromScript] = useState(false);

  useEffect(() => {
    if(generatedTitle) setVideoTitle(generatedTitle);
  }, [generatedTitle]);

  const handleGetFeedback = useCallback(async () => {
    if (!thumbA || !thumbB) return;
    setIsLoading(true); setAiFeedback('');
    const feedback = await getThumbnailFeedback(thumbA.base64, thumbB.base64, language, activePreset.context, isBrandLockActive);
    setAiFeedback(feedback); setIsLoading(false);
  }, [thumbA, thumbB, language, activePreset.context, isBrandLockActive]);

  const handleGenerateFromScript = useCallback(async () => {
    if (!script.trim()) return;
    setIsGeneratingFromScript(true);
    setScriptGeneratedThumb(null);
    const image = await generateSingleThumbnailFromScript(script, contentType, language, activePreset.context, isBrandLockActive);
    setScriptGeneratedThumb(image);
    setIsGeneratingFromScript(false);
  }, [script, contentType, language, activePreset.context, isBrandLockActive]);


  const handleGenerateThumbnails = useCallback(async () => {
    if (!videoTitle.trim()) return;
    setIsGenerating(true); setGeneratedThumbs([]);
    const images = await generateThumbnails(videoTitle, language, script, activePreset.context, isBrandLockActive);
    setGeneratedThumbs(images); setIsGenerating(false);
  }, [videoTitle, language, script, activePreset.context, isBrandLockActive]);

  const handleSetThumbnail = (base64: string, target: 'A' | 'B') => {
    const newThumbnail: Thumbnail = { name: `Generated ${target}`, dataUrl: `data:image/jpeg;base64,${base64}`, base64 };
    if (target === 'A') setThumbA(newThumbnail); else setThumbB(newThumbnail);
  };
  
  const handleGenerateMetadata = useCallback(async () => {
    if (!metadataThumb || !script.trim() || !videoTitle.trim()) return;
    setIsGeneratingMetadata(true);
    setMetadataResult(null);
    const result = await generateImageMetadata(metadataThumb.base64, script, videoTitle, language, activePreset.context, isBrandLockActive);
    setMetadataResult(result);
    setIsGeneratingMetadata(false);
  }, [metadataThumb, script, videoTitle, language, activePreset.context, isBrandLockActive]);

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);
  
  const handleExportFeedback = () => {
    if (!aiFeedback) return;
    downloadTextFile(aiFeedback, 'thumbnail_feedback.txt');
  };

  const handleExportMetadataReport = () => {
      if (!metadataResult) return;
      let content = `--- THUMBNAIL METADATA REPORT ---\n\n`;
      content += `## SEO TAGS:\n${metadataResult.seoTags.join(', ')}\n\n`;
      content += `## ACCESSIBILITY ALT-TEXT:\n${metadataResult.altText}\n\n`;
      content += `## SOCIAL MEDIA CAPTION:\n${metadataResult.socialMediaCaption}\n`;
      downloadTextFile(content, 'thumbnail_metadata_report.txt');
  };

  return (
    <div className="space-y-6">
       <Card>
        <h2 className="text-2xl font-bold mb-2">{t('productionStudio.generateFromScriptTitle')}</h2>
        <p className="text-gray-400 mb-4">{t('productionStudio.generateFromScriptDescription')}</p>
        <Button onClick={handleGenerateFromScript} isLoading={isGeneratingFromScript} disabled={!script.trim()}>
          {t('productionStudio.generateFromScriptButton')}
        </Button>
        {isGeneratingFromScript && <p className="text-gray-400 text-center mt-4">{t('productionStudio.generatingFromScript')}</p>}
        {scriptGeneratedThumb && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">{t('productionStudio.generatedThumbnailTitle')}</h3>
            <div className="max-w-md mx-auto">
              <img src={`data:image/jpeg;base64,${scriptGeneratedThumb}`} alt="Thumbnail generated from script" className="rounded-lg w-full h-auto border border-neutral-700" />
              <div className="flex justify-center gap-2 mt-2">
                <Button variant="secondary" size="sm" onClick={() => handleSetThumbnail(scriptGeneratedThumb, 'A')}>{t('productionStudio.useA')}</Button>
                <Button variant="secondary" size="sm" onClick={() => handleSetThumbnail(scriptGeneratedThumb, 'B')}>{t('productionStudio.useB')}</Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      <Card>
        <h2 className="text-2xl font-bold mb-4">{t('productionStudio.abTest')}</h2>
        <p className="text-gray-400 mb-6">{t('productionStudio.abTestDescription')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <ThumbnailPreview thumbnail={thumbA} />
            <div className="mt-4"><ThumbnailUpload id="thumb-a" label={t('productionStudio.thumbA')} onUpload={setThumbA} /></div>
          </div>
          <div>
            <ThumbnailPreview thumbnail={thumbB} />
            <div className="mt-4"><ThumbnailUpload id="thumb-b" label={t('productionStudio.thumbB')} onUpload={setThumbB} /></div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-bold mb-4">{t('productionStudio.generateConcepts')}</h3>
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input type="text" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} placeholder={t('productionStudio.titlePlaceholder')} className="w-full bg-neutral-700 border border-neutral-600 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple" />
          <Button onClick={handleGenerateThumbnails} isLoading={isGenerating} disabled={!videoTitle.trim()}>{t('productionStudio.generate')}</Button>
        </div>
        {isGenerating && <p className="text-gray-400 text-center">{t('productionStudio.generating')}...</p>}
        {generatedThumbs.length > 0 && <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{generatedThumbs.map((base64, index) => (<div key={index}><img src={`data:image/jpeg;base64,${base64}`} alt={`Gen thumb ${index + 1}`} className="rounded-lg aspect-video object-cover" /><div className="flex justify-center gap-2 mt-2"><Button size="sm" variant="secondary" onClick={() => handleSetThumbnail(base64, 'A')}>{t('productionStudio.useA')}</Button><Button size="sm" variant="secondary" onClick={() => handleSetThumbnail(base64, 'B')}>{t('productionStudio.useB')}</Button></div></div>))}</div>}
      </Card>
      
      <Card>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">{t('productionStudio.aiFeedback')}</h3>
            <Button variant="secondary" size="sm" onClick={handleExportFeedback} disabled={!aiFeedback}>{t('productionStudio.exportFeedback')}</Button>
        </div>
        <Button onClick={handleGetFeedback} isLoading={isLoading} disabled={!thumbA || !thumbB}>{t('productionStudio.analyzeThumbs')}</Button>
        <div className="mt-4 p-4 bg-neutral-900 rounded-md border border-neutral-700 min-h-[150px]">{isLoading ? <p className="text-gray-400">{t('productionStudio.analyzing')}...</p> : aiFeedback ? <p className="text-sm whitespace-pre-wrap">{aiFeedback}</p> : <p className="text-gray-500">{t('productionStudio.feedbackPlaceholder')}</p>}</div>
      </Card>

      <Card>
        <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold">{t('productionStudio.metadataEngineTitle')}</h2>
            <Button variant="secondary" size="sm" onClick={handleExportMetadataReport} disabled={!metadataResult}>{t('productionStudio.exportMetadataReport')}</Button>
        </div>
        <p className="text-gray-400 mb-6">{t('productionStudio.metadataEngineDescription')}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
                <ThumbnailPreview thumbnail={metadataThumb} />
                <div className="mt-4">
                    <ThumbnailUpload id="metadata-thumb" label={t('productionStudio.uploadForMetadata')} onUpload={setMetadataThumb} />
                </div>
            </div>
            <div className="md:col-span-2">
                <Button onClick={handleGenerateMetadata} isLoading={isGeneratingMetadata} disabled={!metadataThumb || !script.trim() || !videoTitle.trim()}>{t('productionStudio.generateMetadataButton')}</Button>
                {isGeneratingMetadata && <p className="text-gray-400 mt-4">{t('productionStudio.generating')}...</p>}
                {metadataResult && (
                    <div className="mt-4 space-y-4">
                        <div>
                            <h4 className="font-semibold text-brand-light mb-1">{t('productionStudio.seoTags')}</h4>
                            <div className="flex flex-wrap gap-2 p-3 bg-neutral-900 rounded-md">{metadataResult.seoTags.map((tag, i) => <span key={i} className="px-2 py-1 bg-neutral-700 text-xs rounded-md">{tag}</span>)}</div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-brand-light mb-1">{t('productionStudio.altText')}</h4>
                            <div className="p-3 bg-neutral-900 rounded-md text-sm relative"><p>{metadataResult.altText}</p><button onClick={() => copyToClipboard(metadataResult.altText)} className="absolute top-2 right-2 text-gray-400 hover:text-white" title={t('productionStudio.copy')}><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button></div>
                        </div>
                         <div>
                            <h4 className="font-semibold text-brand-light mb-1">{t('productionStudio.socialCaption')}</h4>
                            <div className="p-3 bg-neutral-900 rounded-md text-sm whitespace-pre-wrap relative"><p>{metadataResult.socialMediaCaption}</p><button onClick={() => copyToClipboard(metadataResult.socialMediaCaption)} className="absolute top-2 right-2 text-gray-400 hover:text-white" title={t('productionStudio.copy')}><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </Card>
    </div>
  );
};
// --- END of Thumbnail Tester Logic ---

interface ProductionStudioProps {
  script: string;
  setScript: (script: string) => void;
}

const ProductionStudio: React.FC<ProductionStudioProps> = ({ script, setScript }) => {
  const { t } = useLocalization();
  const { isBrandLockActive } = usePreset();
  const [activeTab, setActiveTab] = useState<'script' | 'optimize' | 'thumbnails'>('script');
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [contentType, setContentType] = useState<'16:9' | '9:16'>('16:9');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'script':
        return <ScriptEditor script={script} setScript={setScript} isBrandLockActive={isBrandLockActive} />;
      case 'optimize':
        return <Optimizer script={script} setGeneratedTitle={setGeneratedTitle} isBrandLockActive={isBrandLockActive} />;
      case 'thumbnails':
        return <ThumbnailStudio generatedTitle={generatedTitle} script={script} contentType={contentType} isBrandLockActive={isBrandLockActive} />;
      default:
        return null;
    }
  };

  const TabButton: React.FC<{tab: 'script' | 'optimize' | 'thumbnails', label: string, step: number}> = ({tab, label, step}) => (
      <button onClick={() => setActiveTab(tab)} className={`flex items-center gap-2 sm:gap-3 px-3 py-2 text-sm sm:text-base rounded-md font-semibold transition-colors ${activeTab === tab ? 'bg-brand-purple text-white' : 'bg-neutral-700 hover:bg-neutral-600'}`}>
         <span className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full text-sm ${activeTab === tab ? 'bg-white text-brand-purple' : 'bg-neutral-600 text-gray-200'}`}>{step}</span>
         {label}
      </button>
  )

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-2">{t('productionStudio.title')}</h2>
      <p className="text-gray-400 mb-4">{t('productionStudio.description')}</p>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">{t('productionStudio.contentFormat')}</label>
        <div className="flex bg-neutral-800 p-1 rounded-lg border border-neutral-700 w-full max-w-xs">
          <button onClick={() => setContentType('16:9')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${contentType === '16:9' ? 'bg-brand-purple text-white' : 'text-gray-300 hover:bg-neutral-700'}`}>
            {t('productionStudio.longForm')}
          </button>
          <button onClick={() => setContentType('9:16')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${contentType === '9:16' ? 'bg-brand-purple text-white' : 'text-gray-300 hover:bg-neutral-700'}`}>
            {t('productionStudio.shortForm')}
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6 border-b border-neutral-700 pb-4">
        <TabButton tab="script" label={t('productionStudio.tabScript')} step={1} />
        <TabButton tab="optimize" label={t('productionStudio.tabOptimize')} step={2} />
        <TabButton tab="thumbnails" label={t('productionStudio.tabThumbnails')} step={3} />
      </div>

      <div>
        {renderTabContent()}
      </div>
    </Card>
  );
};

export default ProductionStudio;