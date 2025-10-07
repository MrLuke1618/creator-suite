

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { useLocalization } from '../contexts/LocalizationContext';
import { usePreset } from '../contexts/PresetContext';
import { startVideoGeneration, checkVideoGenerationStatus, generateVideoPromptSuggestion, generateSubtitles } from '../services/geminiService';

type Mode = 'cinematic' | 'animation' | 'motion_graphics' | 'morph' | 'timelapse' | 'hyperlapse' | 'drone_shot' | 'vintage_film';
type Preset = 'none' | 'trailer' | 'explainer' | 'product' | 'dreamscape' | 'food' | 'noir_film' | 'documentary' | 'vaporwave' | 'pixel_art';

const VideoLab: React.FC = () => {
  const { t, language } = useLocalization();
  const { activePreset, isBrandLockActive } = usePreset();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<Mode>('cinematic');
  const [preset, setPreset] = useState<Preset>('none');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [operation, setOperation] = useState<any>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLooping, setIsLooping] = useState(true);
  
  const [videoDuration, setVideoDuration] = useState(0);
  const [subtitles, setSubtitles] = useState<string | null>(null);
  const [isGeneratingSubtitles, setIsGeneratingSubtitles] = useState(false);

  const modes = useMemo(() => ([
    { value: 'cinematic', label: t('videoLab.modes.cinematic') },
    { value: 'animation', label: t('videoLab.modes.animation') },
    { value: 'motion_graphics', label: t('videoLab.modes.motion_graphics') },
    { value: 'morph', label: t('videoLab.modes.morph') },
    { value: 'timelapse', label: t('videoLab.modes.timelapse') },
    { value: 'hyperlapse', label: t('videoLab.modes.hyperlapse') },
    { value: 'drone_shot', label: t('videoLab.modes.drone_shot') },
    { value: 'vintage_film', label: t('videoLab.modes.vintage_film') },
  ]), [t]);

  const promptHelper = useMemo(() => {
    return t(`videoLab.promptHelpers.${mode}`);
  }, [mode, t]);
  
  const loadingMessages = useMemo(() => t('videoLab.loadingMessages'), [t]);

  // Effect for cycling loading messages
  useEffect(() => {
    let interval: number;
    if (isLoading) {
      setLoadingMessage(loadingMessages[0]);
      let index = 0;
      interval = window.setInterval(() => {
        index = (index + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[index]);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isLoading, loadingMessages]);

  // Effect for polling generation status
  useEffect(() => {
    let interval: number;
    if (operation && !operation.done && isLoading) {
      interval = window.setInterval(async () => {
        try {
          const updatedOperation = await checkVideoGenerationStatus(operation);
          setOperation(updatedOperation);

          if (updatedOperation.done) {
            setIsLoading(false);
            const downloadLink = updatedOperation.response?.generatedVideos?.[0]?.video?.uri;
            if (downloadLink && process.env.API_KEY) {
                const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
                const blob = await response.blob();
                const objectUrl = URL.createObjectURL(blob);
                setVideoUrl(objectUrl);
            } else {
                throw new Error("Video generation finished, but no download link was provided.");
            }
          }
        } catch (err) {
          console.error(err);
          setError(err instanceof Error ? err.message : String(err));
          setIsLoading(false);
        }
      }, 10000);
    }

    return () => clearInterval(interval);
  }, [operation, isLoading]);

  // Effect for controlling video player properties
  useEffect(() => {
    if (videoRef.current) {
        videoRef.current.playbackRate = playbackRate;
        videoRef.current.loop = isLooping;
    }
  }, [playbackRate, isLooping, videoUrl]);

  // Effect for presets
  useEffect(() => {
    if (preset === 'none') return;
    const newPrompt = t(`videoLab.presetPrompts.${preset}`);
    setPrompt(newPrompt);
    if(preset === 'trailer') setMode('cinematic');
    if(preset === 'explainer') setMode('animation');
    if(preset === 'product') setMode('motion_graphics');
    if(preset === 'dreamscape') setMode('animation');
    if(preset === 'food') setMode('cinematic');
    if(preset === 'noir_film') setMode('vintage_film');
    if(preset === 'documentary') setMode('drone_shot');
    if(preset === 'vaporwave') setMode('animation');
    if(preset === 'pixel_art') setMode('animation');
  }, [preset, t]);


  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setVideoUrl(null);
    setOperation(null);
    setPreset('none');
    setSubtitles(null);
    setVideoDuration(0);

    const finalPrompt = `${modes.find(m => m.value === mode)?.label}: ${prompt}`;

    try {
      const initialOperation = await startVideoGeneration(finalPrompt, activePreset.context, isBrandLockActive);
      setOperation(initialOperation);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : String(err));
      setIsLoading(false);
    }
  }, [prompt, mode, modes, activePreset.context, isBrandLockActive]);
  
  const handleGetAiSuggestion = useCallback(async () => {
    setIsSuggesting(true);
    const suggestion = await generateVideoPromptSuggestion(language, activePreset.context, isBrandLockActive);
    setPrompt(suggestion);
    setPreset('none');
    setIsSuggesting(false);
  }, [language, activePreset.context, isBrandLockActive]);

  const handleGenerateSubtitles = useCallback(async () => {
    if (!prompt || videoDuration === 0) return;
    setIsGeneratingSubtitles(true);
    setSubtitles(null);
    try {
      const vttString = await generateSubtitles(prompt, videoDuration, language, activePreset.context, isBrandLockActive);
      const vttBlob = new Blob([vttString], { type: 'text/vtt' });
      // Clean up old blob URL if it exists
      if (subtitles && subtitles.startsWith('blob:')) {
        URL.revokeObjectURL(subtitles);
      }
      const vttUrl = URL.createObjectURL(vttBlob);
      setSubtitles(vttUrl);
    } catch (err) {
      console.error("Failed to generate subtitles", err);
      // Optionally set an error state to show in UI
    } finally {
      setIsGeneratingSubtitles(false);
    }
  }, [prompt, videoDuration, language, subtitles, activePreset.context, isBrandLockActive]);


  return (
    <Card>
      <h2 className="text-2xl font-bold mb-2">{t('videoLab.title')}</h2>
      <p className="text-gray-400 mb-6">{t('videoLab.description')}</p>

      <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-200 px-4 py-3 rounded-lg relative mb-6" role="alert">
        <strong className="font-bold">{t('videoLab.warningTitle')}</strong>
        <span className="block sm:inline ml-2">{t('videoLab.warningContent')}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <label htmlFor="video-prompt" className="block text-sm font-medium text-gray-300 mb-2">{t('videoLab.promptLabel')}</label>
          <textarea
            id="video-prompt"
            value={prompt}
            onChange={(e) => {
                setPrompt(e.target.value);
                setPreset('none');
            }}
            placeholder={promptHelper}
            rows={5}
            className="w-full bg-neutral-700 border border-neutral-600 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
            disabled={isLoading}
          />
           <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-400 mb-2">{t('videoLab.promptSuggestionsTitle')}</h4>
            <div className="flex flex-wrap gap-2 items-center">
              {t('videoLab.promptSuggestions').map((suggestion: string, index: number) => (
                <button
                  key={index}
                  onClick={() => {
                      setPrompt(suggestion);
                      setPreset('none');
                  }}
                  disabled={isLoading}
                  className="px-3 py-1 bg-neutral-700 text-xs rounded-full hover:bg-neutral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
            <div>
              <label htmlFor="video-preset" className="block text-sm font-medium text-gray-300 mb-2">{t('videoLab.presetLabel')}</label>
              <select
                id="video-preset"
                value={preset}
                onChange={(e) => setPreset(e.target.value as Preset)}
                className="w-full bg-neutral-700 border border-neutral-600 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
                disabled={isLoading}
              >
                  <option value="none">{t('videoLab.presets.none')}</option>
                  <option value="trailer">{t('videoLab.presets.trailer')}</option>
                  <option value="explainer">{t('videoLab.presets.explainer')}</option>
                  <option value="product">{t('videoLab.presets.product')}</option>
                  <option value="dreamscape">{t('videoLab.presets.dreamscape')}</option>
                  <option value="food">{t('videoLab.presets.food')}</option>
                  <option value="noir_film">{t('videoLab.presets.noir_film')}</option>
                  <option value="documentary">{t('videoLab.presets.documentary')}</option>
                  <option value="vaporwave">{t('videoLab.presets.vaporwave')}</option>
                  <option value="pixel_art">{t('videoLab.presets.pixel_art')}</option>
              </select>
            </div>
            <div>
              <label htmlFor="video-mode" className="block text-sm font-medium text-gray-300 mb-2">{t('videoLab.modeLabel')}</label>
              <select
                id="video-mode"
                value={mode}
                onChange={(e) => {
                    setMode(e.target.value as Mode)
                    setPreset('none');
                }}
                className="w-full bg-neutral-700 border border-neutral-600 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
                disabled={isLoading}
              >
                {modes.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
        </div>
      </div>
      
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button onClick={handleGenerate} isLoading={isLoading} disabled={!prompt.trim()}>
          {t('videoLab.generateButton')}
        </Button>
        <Button
          variant="primary"
          onClick={handleGetAiSuggestion}
          isLoading={isSuggesting}
          disabled={isLoading}
        >
          {t('videoLab.getAISuggestionButton')}
        </Button>
      </div>
      
      <div className="mt-6">
        {isLoading && (
          <div className="text-center p-8 bg-neutral-800 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">{t('videoLab.generatingTitle')}</h3>
            <div className="flex justify-center items-center mb-4">
              <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-brand-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-gray-300">{loadingMessage}</p>
          </div>
        )}
        {error && (
          <div className="text-center p-8 bg-red-900/50 border border-red-700 rounded-lg">
            <h3 className="text-xl font-semibold text-red-200 mb-2">{t('videoLab.errorTitle')}</h3>
            <p className="text-red-300 mb-4">{error}</p>
            <Button variant="secondary" onClick={handleGenerate}>{t('videoLab.tryAgain')}</Button>
          </div>
        )}
        {videoUrl && (
          <div className="space-y-4">
            <video 
                ref={videoRef} 
                controls 
                autoPlay 
                src={videoUrl} 
                className="w-full max-w-2xl mx-auto rounded-lg aspect-video bg-black"
                crossOrigin="anonymous"
                onLoadedMetadata={(e) => setVideoDuration(e.currentTarget.duration)}
            >
                {subtitles && <track label="English" kind="subtitles" srcLang="en" src={subtitles} default />}
            </video>
            <div className="max-w-2xl mx-auto p-3 bg-neutral-800 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">{t('videoLab.playbackSpeed')}:</label>
                    {[0.5, 1, 1.5, 2].map(rate => (
                        <button key={rate} onClick={() => setPlaybackRate(rate)} className={`px-2.5 py-1 text-xs rounded-md transition-colors ${playbackRate === rate ? 'bg-brand-purple text-white' : 'bg-neutral-700 hover:bg-neutral-600'}`}>
                            {rate}x
                        </button>
                    ))}
                </div>
                 <div className="w-full sm:w-auto h-px sm:h-6 bg-neutral-700"></div>
                 <label htmlFor="loop-toggle" className="flex items-center gap-2 cursor-pointer">
                    <div className="relative">
                        <input type="checkbox" id="loop-toggle" className="sr-only" checked={isLooping} onChange={() => setIsLooping(!isLooping)} />
                        <div className={`block w-10 h-5 rounded-full transition-colors ${isLooping ? 'bg-brand-purple' : 'bg-neutral-600'}`}></div>
                        <div className={`dot absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${isLooping ? 'transform translate-x-full' : ''}`}></div>
                    </div>
                    <span className="text-sm font-medium">{t('videoLab.loop')}</span>
                </label>
                <div className="w-full sm:w-auto h-px sm:h-6 bg-neutral-700"></div>
                 <Button
                    variant="secondary"
                    onClick={handleGenerateSubtitles}
                    isLoading={isGeneratingSubtitles}
                    disabled={videoDuration === 0}
                    size="sm"
                >
                    {t('videoLab.generateSubtitlesButton')}
                </Button>
                <a 
                    href={videoUrl} 
                    download={`creator_suite_video_${Date.now()}.mp4`}
                    className="inline-flex items-center justify-center gap-2 px-3 py-1.5 font-semibold rounded-md transition-colors text-sm bg-neutral-700 hover:bg-neutral-600 text-gray-200 focus:ring-neutral-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    {t('videoLab.downloadButton')}
                </a>
                {subtitles && (
                    <a 
                        href={subtitles} 
                        download="subtitles.vtt"
                        className="inline-flex items-center justify-center gap-2 px-3 py-1.5 font-semibold rounded-md transition-colors text-sm bg-neutral-700 hover:bg-neutral-600 text-gray-200 focus:ring-neutral-500"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        {t('videoLab.downloadSubtitlesButton')}
                    </a>
                )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default VideoLab;
