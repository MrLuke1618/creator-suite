import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';

interface TeleprompterProps {
  script: string;
  onClose: () => void;
}

const Teleprompter: React.FC<TeleprompterProps> = ({ script, onClose }) => {
    const { t } = useLocalization();
    const [speed, setSpeed] = useState(150); // Words per minute
    const [fontSize, setFontSize] = useState(48); // in pixels
    const [isMirrored, setIsMirrored] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showControls, setShowControls] = useState(true);

    const contentRef = useRef<HTMLDivElement>(null);
    const scrollIntervalRef = useRef<number | null>(null);
    const controlsTimeoutRef = useRef<number | null>(null);

    const hideControls = () => {
        if(controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = window.setTimeout(() => setShowControls(false), 3000);
    };

    useEffect(() => {
        const handleMouseMove = () => {
            setShowControls(true);
            hideControls();
        };

        window.addEventListener('mousemove', handleMouseMove);
        hideControls(); // Initial hide

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
            if (scrollIntervalRef.current) cancelAnimationFrame(scrollIntervalRef.current);
        };
    }, []);

    const startScrolling = useCallback(() => {
        const element = contentRef.current;
        if (!element) return;
        
        let lastTime = performance.now();
        const pixelsPerSecond = (speed / 60) * (fontSize / 4); // Heuristic for scroll speed

        const scroll = (currentTime: number) => {
            const deltaTime = (currentTime - lastTime) / 1000;
            element.scrollTop += pixelsPerSecond * deltaTime;
            lastTime = currentTime;

            if (element.scrollTop < element.scrollHeight - element.clientHeight) {
                scrollIntervalRef.current = requestAnimationFrame(scroll);
            } else {
                setIsPlaying(false);
            }
        };

        scrollIntervalRef.current = requestAnimationFrame(scroll);
    }, [speed, fontSize]);


    useEffect(() => {
        if (isPlaying) {
            startScrolling();
        } else {
            if (scrollIntervalRef.current) {
                cancelAnimationFrame(scrollIntervalRef.current);
            }
        }

        return () => {
             if (scrollIntervalRef.current) {
                cancelAnimationFrame(scrollIntervalRef.current);
            }
        }
    }, [isPlaying, startScrolling]);

    const handlePlayPause = () => {
        setIsPlaying(prev => !prev);
    };

  return (
    <div className="fixed inset-0 bg-black text-white z-50 flex flex-col items-center justify-center font-sans">
      {/* Top Reading Guide */}
      <div className="absolute top-1/3 left-0 right-0 h-px bg-red-500 opacity-50"></div>
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-red-500"></div>

      {/* Script Content */}
      <div 
        ref={contentRef} 
        className="w-full h-full overflow-y-scroll scroll-smooth pt-[33vh] pb-[67vh] px-4 sm:px-8 no-scrollbar"
        style={{ transform: isMirrored ? 'scaleX(-1)' : 'scaleX(1)' }}
      >
        <p 
            className="text-center whitespace-pre-wrap"
            style={{ 
                fontSize: `${fontSize}px`, 
                lineHeight: 1.5,
                transform: isMirrored ? 'scaleX(-1)' : 'scaleX(1)'
            }}
        >
            {script}
        </p>
      </div>

       {/* Controls */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onMouseEnter={() => {if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)}}
        onMouseLeave={hideControls}
        >
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <button onClick={onClose} className="text-sm px-4 py-2 bg-neutral-700 rounded-md hover:bg-neutral-600 transition-colors">
            {t('teleprompter.exit')}
          </button>

          <div className="flex items-center gap-4">
              <button onClick={handlePlayPause} className="p-3 bg-neutral-700 rounded-full hover:bg-neutral-600 transition-colors">
                {isPlaying ? 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> :
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                }
              </button>
            <div className="flex items-center gap-2">
                <label className="text-sm whitespace-nowrap">{t('teleprompter.speed')}:</label>
                <input type="range" min="80" max="300" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-24 accent-brand-purple" />
            </div>
             <div className="flex items-center gap-2">
                <label className="text-sm whitespace-nowrap">{t('teleprompter.fontSize')}:</label>
                <input type="range" min="24" max="120" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-24 accent-brand-purple" />
            </div>
          </div>
          
           <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" checked={isMirrored} onChange={(e) => setIsMirrored(e.target.checked)} className="h-4 w-4 accent-brand-purple" />
                {t('teleprompter.mirror')}
            </label>
        </div>
      </div>
    </div>
  );
};

export default Teleprompter;

// CSS for hiding scrollbar
const style = document.createElement('style');
style.textContent = `
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
document.head.append(style);