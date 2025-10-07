import React, { useState, useCallback, ChangeEvent } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { Thumbnail } from '../types';
import { getThumbnailFeedback, generateThumbnails } from '../services/geminiService';
import { useLocalization } from '../contexts/LocalizationContext';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // remove data url prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = error => reject(error);
  });
};


const ThumbnailUpload: React.FC<{ onUpload: (thumbnail: Thumbnail) => void, id: string, label: string }> = ({ onUpload, id, label }) => {
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      const dataUrl = URL.createObjectURL(file);
      onUpload({ name: file.name, dataUrl, base64 });
    }
  };

  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-600 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="flex text-sm text-gray-500">
            <label htmlFor={id} className="relative cursor-pointer bg-neutral-800 rounded-md font-medium text-brand-purple hover:text-violet-400 focus-within:outline-none">
              <span>Upload a file</span>
              <input id={id} name={id} type="file" className="sr-only" accept="image/png, image/jpeg" onChange={handleFileChange} />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
        </div>
      </div>
    </div>
  );
};


const ThumbnailPreview: React.FC<{ thumbnail: Thumbnail | null, showGrid: boolean }> = ({ thumbnail, showGrid }) => {
    return (
        <div className="bg-neutral-900 aspect-video rounded-lg overflow-hidden relative flex items-center justify-center border border-neutral-700">
            {thumbnail ? (
                <>
                    <img src={thumbnail.dataUrl} alt={thumbnail.name} className="object-contain w-full h-full" />
                    {showGrid && (
                        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                            <div className="col-span-1 row-span-1 border-r border-b border-white/30"></div>
                            <div className="col-span-1 row-span-1 border-r border-b border-white/30"></div>
                            <div className="col-span-1 row-span-1 border-b border-white/30"></div>
                            <div className="col-span-1 row-span-1 border-r border-b border-white/30"></div>
                            <div className="col-span-1 row-span-1 border-r border-b border-white/30"></div>
                            <div className="col-span-1 row-span-1 border-b border-white/30"></div>
                            <div className="col-span-1 row-span-1 border-r border-white/30"></div>
                            <div className="col-span-1 row-span-1 border-r border-white/30"></div>
                        </div>
                    )}
                </>
            ) : (
                <p className="text-gray-500">No image uploaded</p>
            )}
        </div>
    );
};


const ThumbnailTester: React.FC = () => {
  const [thumbA, setThumbA] = useState<Thumbnail | null>(null);
  const [thumbB, setThumbB] = useState<Thumbnail | null>(null);
  const [showGrid, setShowGrid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState('');
  
  const [videoTitle, setVideoTitle] = useState('');
  const [generatedThumbs, setGeneratedThumbs] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { language } = useLocalization();

  const handleGetFeedback = useCallback(async () => {
    if (!thumbA || !thumbB) return;
    setIsLoading(true);
    setAiFeedback('');
    const feedback = await getThumbnailFeedback(thumbA.base64, thumbB.base64, language);
    setAiFeedback(feedback);
    setIsLoading(false);
  }, [thumbA, thumbB, language]);

  const handleGenerateThumbnails = useCallback(async () => {
    if (!videoTitle.trim()) return;
    setIsGenerating(true);
    setGeneratedThumbs([]);
    const images = await generateThumbnails(videoTitle, language);
    setGeneratedThumbs(images);
    setIsGenerating(false);
  }, [videoTitle, language]);

  const handleSetThumbnail = (base64: string, target: 'A' | 'B') => {
    const newThumbnail: Thumbnail = {
        name: `Generated Thumbnail - ${target}`,
        dataUrl: `data:image/jpeg;base64,${base64}`,
        base64: base64,
    };
    if (target === 'A') {
        setThumbA(newThumbnail);
    } else {
        setThumbB(newThumbnail);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Thumbnail A/B Tester</h2>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
             <label htmlFor="show-grid" className="flex items-center cursor-pointer">
                <div className="relative">
                    <input type="checkbox" id="show-grid" className="sr-only" checked={showGrid} onChange={() => setShowGrid(!showGrid)} />
                    <div className={`block w-14 h-8 rounded-full transition-colors ${showGrid ? 'bg-brand-purple' : 'bg-neutral-600'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ease-in-out ${showGrid ? 'transform translate-x-full' : ''}`}></div>
                </div>
                <div className="ml-3 text-gray-300">Rule of Thirds Grid</div>
            </label>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ThumbnailPreview thumbnail={thumbA} showGrid={showGrid} />
            <div className="mt-4"><ThumbnailUpload id="thumb-a-upload" label="Thumbnail A" onUpload={setThumbA} /></div>
          </div>
          <div>
            <ThumbnailPreview thumbnail={thumbB} showGrid={showGrid} />
            <div className="mt-4"><ThumbnailUpload id="thumb-b-upload" label="Thumbnail B" onUpload={setThumbB} /></div>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-2xl font-bold mb-4">Generate Thumbnails with AI</h2>
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            placeholder="Enter your video title..."
            className="w-full bg-neutral-700 border border-neutral-600 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
          />
          <Button onClick={handleGenerateThumbnails} isLoading={isGenerating} disabled={!videoTitle.trim()}>
            Generate Concepts
          </Button>
        </div>
        {isGenerating && <p className="text-gray-400 text-center">Generating... this may take a moment.</p>}
        {generatedThumbs.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mt-4 mb-2">Generated Concepts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedThumbs.map((base64, index) => (
                <div key={index}>
                  <img src={`data:image/jpeg;base64,${base64}`} alt={`Generated thumbnail ${index + 1}`} className="rounded-lg aspect-video object-cover" />
                  <div className="flex justify-center gap-2 mt-2">
                    <Button variant="secondary" size="sm" onClick={() => handleSetThumbnail(base64, 'A')}>Use for A</Button>
                    <Button variant="secondary" size="sm" onClick={() => handleSetThumbnail(base64, 'B')}>Use for B</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
      
      <Card>
        <h2 className="text-2xl font-bold mb-4">AI Feedback</h2>
        <Button onClick={handleGetFeedback} isLoading={isLoading} disabled={!thumbA || !thumbB}>
          Get AI Feedback
        </Button>
        <div className="mt-4 p-4 bg-neutral-900 rounded-md border border-neutral-700 min-h-[150px]">
          {isLoading ? (
            <p className="text-gray-400">Analyzing thumbnails...</p>
          ) : aiFeedback ? (
            <p className="text-sm whitespace-pre-wrap">{aiFeedback}</p>
          ) : (
            <p className="text-gray-500">Upload two thumbnails and click the button to get AI-powered feedback on which one is better and why.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ThumbnailTester;
