

import React, { useState, useCallback, useEffect, ChangeEvent } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { generateContentIdeas, analyzeImportedIdeas, findViralClips } from '../services/geminiService';
import { BrainstormIdea, CalendarEvent, ContentStatus, IdeaLabResult, ViralClipsResult, ViralClipSuggestion } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';
import { usePreset } from '../contexts/PresetContext';

interface IdeaLabProps {
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  seedTopic?: string;
  onSeedTopicUsed?: () => void;
}

const downloadTextFile = (content: string, filename: string, type: string = 'text/plain') => {
    const blob = new Blob([content], { type });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
};


const IdeaLab: React.FC<IdeaLabProps> = ({ setEvents, seedTopic, onSeedTopicUsed }) => {
  const { t, language } = useLocalization();
  const { activePreset, isBrandLockActive } = usePreset();
  
  // State for Idea Generation
  const [topic, setTopic] = useState('');
  const [ideaFile, setIdeaFile] = useState<File | null>(null);
  const [ideaResults, setIdeaResults] = useState<IdeaLabResult | null>(null);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  
  // State for Viral Clip Finder
  const [viralClipFile, setViralClipFile] = useState<File | null>(null);
  const [viralClipResults, setViralClipResults] = useState<ViralClipsResult | null>(null);
  const [isFindingClips, setIsFindingClips] = useState(false);

  useEffect(() => {
    if (seedTopic && onSeedTopicUsed) {
      setTopic(seedTopic);
      setIdeaFile(null);
      onSeedTopicUsed();
    }
  }, [seedTopic, onSeedTopicUsed]);
  
  const handleTopicChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTopic(e.target.value);
    if (e.target.value) setIdeaFile(null);
  };

  const handleIdeaFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdeaFile(file);
      setTopic('');
    }
  };

  const handleViralClipFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setViralClipFile(file);
  };
  
  const handleGenerateIdeas = useCallback(async () => {
    setIsGeneratingIdeas(true);
    setIdeaResults(null);

    if (ideaFile) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target?.result as string;
            if (text) {
                const result = await analyzeImportedIdeas(text, language, activePreset.context, isBrandLockActive);
                setIdeaResults(result);
            }
            setIsGeneratingIdeas(false);
        };
        reader.readAsText(ideaFile);
    } else if (topic.trim()) {
        const result = await generateContentIdeas(topic, language, activePreset.context, isBrandLockActive);
        setIdeaResults(result);
        setIsGeneratingIdeas(false);
    } else {
        setIsGeneratingIdeas(false);
    }
  }, [topic, ideaFile, language, activePreset.context, isBrandLockActive]);

  const handleFindClips = useCallback(async () => {
    if (!viralClipFile) return;
    setIsFindingClips(true);
    setViralClipResults(null);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
        const text = e.target?.result as string;
        if (text) {
            const result = await findViralClips(text, language, activePreset.context, isBrandLockActive);
            setViralClipResults(result);
        }
        setIsFindingClips(false);
    };
    reader.readAsText(viralClipFile);
  }, [viralClipFile, language, activePreset.context, isBrandLockActive]);

  const addIdeaToCalendar = (idea: BrainstormIdea) => {
    const newEvent: CalendarEvent = {
        id: `idea-${Date.now()}`,
        title: idea.title,
        date: new Date().toISOString().split('T')[0],
        status: ContentStatus.IDEA,
        platform: 'YouTube'
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const addClipToCalendar = (clip: ViralClipSuggestion) => {
    const newEvent: CalendarEvent = {
        id: `clip-${Date.now()}`,
        title: clip.suggestedTitle,
        date: new Date().toISOString().split('T')[0],
        status: ContentStatus.IDEA,
        platform: 'YouTube Shorts'
    };
    setEvents(prev => [...prev, newEvent]);
  };
  
  const isGenerateDisabled = (!topic.trim() && !ideaFile) || isGeneratingIdeas;
  const isFindClipsDisabled = !viralClipFile || isFindingClips;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* --- IDEA GENERATION --- */}
      <Card>
        <h2 className="text-2xl font-bold mb-4">{t('ideaLab.title')}</h2>
        <p className="text-gray-400 mb-6">{t('ideaLab.description')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
                <label htmlFor="topic-input" className="block text-sm font-medium text-gray-300 mb-2">{t('ideaLab.generateFromTopic')}</label>
                <input id="topic-input" type="text" value={topic} onChange={handleTopicChange} placeholder={t('ideaLab.placeholder')} className="w-full bg-neutral-700 border border-neutral-600 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"/>
            </div>
             <div className="relative text-center my-4 md:hidden"><span className="absolute left-0 top-1/2 w-full h-px bg-neutral-700"></span><span className="relative bg-neutral-800 px-2 text-xs uppercase text-gray-400">Or</span></div>
            <div>
                <label htmlFor="idea-file-import" className="block text-sm font-medium text-gray-300 mb-2">{t('ideaLab.importTitle')}</label>
                 <label className="w-full flex items-center justify-center px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-sm cursor-pointer hover:bg-neutral-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    {ideaFile ? ideaFile.name : t('ideaLab.importLabel')}
                    <input id="idea-file-import" type="file" className="hidden" accept=".txt,.md" onChange={handleIdeaFileChange} />
                </label>
            </div>
        </div>
        <div className="mt-6">
             <Button onClick={handleGenerateIdeas} isLoading={isGeneratingIdeas} disabled={isGenerateDisabled} className="w-full md:w-auto">{t('ideaLab.generateInsights')}</Button>
        </div>
      </Card>

      {isGeneratingIdeas && <div className="text-center py-8"><p className="text-gray-400">{t('ideaLab.generating')}</p></div>}
      {ideaResults && <IdeaResultsDisplay results={ideaResults} addIdeaToCalendar={addIdeaToCalendar} />}

      <div className="border-t-2 border-dashed border-neutral-700 my-8"></div>

      {/* --- VIRAL CLIP FINDER --- */}
      <Card>
        <h2 className="text-2xl font-bold mb-4">{t('ideaLab.viralClipFinder.title')}</h2>
        <p className="text-gray-400 mb-6">{t('ideaLab.viralClipFinder.description')}</p>
        <div className="max-w-md">
            <label htmlFor="viral-clip-file-import" className="block text-sm font-medium text-gray-300 mb-2">{t('ideaLab.viralClipFinder.importLabel')}</label>
            <label className="w-full flex items-center justify-center px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-sm cursor-pointer hover:bg-neutral-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                {viralClipFile ? viralClipFile.name : t('ideaLab.viralClipFinder.importLabel')}
                <input id="viral-clip-file-import" type="file" className="hidden" accept=".txt,.md" onChange={handleViralClipFileChange} />
            </label>
        </div>
        <div className="mt-6">
            <Button onClick={handleFindClips} isLoading={isFindingClips} disabled={isFindClipsDisabled} className="w-full md:w-auto">{t('ideaLab.viralClipFinder.findClips')}</Button>
        </div>
      </Card>
      
      {isFindingClips && <div className="text-center py-8"><p className="text-gray-400">{t('ideaLab.viralClipFinder.finding')}</p></div>}
      {viralClipResults && <ViralClipResultsDisplay results={viralClipResults} addClipToCalendar={addClipToCalendar} />}
    </div>
  );
};

const IdeaResultsDisplay: React.FC<{results: IdeaLabResult, addIdeaToCalendar: (idea: BrainstormIdea) => void}> = ({ results, addIdeaToCalendar }) => {
    const { t } = useLocalization();

    const handleExport = () => {
        let mdContent = `# Idea Lab Report\n\n`;
        mdContent += `## Target Audience\n${results.targetAudience}\n\n`;
        mdContent += `## Suggested Formats\n${results.suggestedFormats.join(', ')}\n\n`;
        mdContent += `## Generated Ideas\n\n`;
        results.ideas.forEach((idea, index) => {
            mdContent += `### Idea ${index + 1}: ${idea.title}\n`;
            mdContent += `**Description:** ${idea.description}\n\n`;
            mdContent += `**Hook:** *"${idea.hook}"*\n\n`;
            mdContent += `**Keywords:** ${idea.keywords.join(', ')}\n\n`;
            mdContent += `**Monetization:** ${idea.monetization}\n\n`;
            mdContent += `**Visual Concepts:**\n${idea.visualConcepts.map(vc => `- ${vc}`).join('\n')}\n\n`;
            mdContent += `**SFX/Animation:**\n${idea.sfxSuggestions.map(sfx => `- ${sfx}`).join('\n')}\n\n`;
            mdContent += `---\n\n`;
        });
        downloadTextFile(mdContent, 'idea_lab_report.md', 'text/markdown');
    };

    return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">{t('ideaLab.generatedIdeas')}</h3>
                    <Button variant="secondary" size="sm" onClick={handleExport}>{t('ideaLab.exportReport')}</Button>
                </div>
                <div className="space-y-4">{results.ideas.map((idea, index) => (<div key={index} className="p-4 bg-neutral-900 rounded-md border border-neutral-700">
                    <div className="flex justify-between items-start gap-4"><div className="flex-grow"><h4 className="font-semibold">{idea.title}</h4><p className="text-sm text-gray-400 mt-1">{idea.description}</p></div><Button variant="secondary" size="sm" onClick={() => addIdeaToCalendar(idea)} className="flex-shrink-0">{t('ideaLab.addToCalendar')}</Button></div>
                    <div className="mt-4 pt-4 border-t border-neutral-800 space-y-4">
                        <div><h5 className="font-semibold text-sm flex items-center gap-2 text-gray-300"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>{t('ideaLab.engagementHook')}</h5><p className="text-sm text-gray-400 pl-6 italic">"{idea.hook}"</p></div>
                        <div><h5 className="font-semibold text-sm flex items-center gap-2 text-gray-300"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" /></svg>{t('ideaLab.keywords')}</h5><div className="flex flex-wrap gap-2 mt-2 pl-6">{idea.keywords.map((kw, kwIndex) => <span key={kwIndex} className="px-2 py-0.5 bg-neutral-700 text-xs rounded-full">{kw}</span>)}</div></div>
                        <div><h5 className="font-semibold text-sm flex items-center gap-2 text-gray-300"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>{t('ideaLab.monetizationStrategy')}</h5><p className="text-sm text-gray-400 pl-6">{idea.monetization}</p></div>
                        <div><h5 className="font-semibold text-sm flex items-center gap-2 text-gray-300"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>{t('ideaLab.visualConcepts')}</h5><ul className="text-sm text-gray-400 pl-6 list-disc list-inside mt-1">{idea.visualConcepts.map((vc, vcIndex) => <li key={vcIndex}>{vc}</li>)}</ul></div>
                        <div><h5 className="font-semibold text-sm flex items-center gap-2 text-gray-300"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.636 5.636a9 9 0 0112.728 0m18.364 18.364A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>{t('ideaLab.sfxSuggestions')}</h5><ul className="text-sm text-gray-400 pl-6 list-disc list-inside mt-1">{idea.sfxSuggestions.map((sfx, sfxIndex) => <li key={sfxIndex}>{sfx}</li>)}</ul></div>
                    </div></div>))}</div>
            </Card>
        </div>
        <div className="lg:col-span-1 space-y-6">
            <Card><h3 className="text-xl font-bold mb-2">{t('ideaLab.targetAudience')}</h3><p className="text-sm text-gray-300">{results.targetAudience}</p></Card>
            <Card><h3 className="text-xl font-bold mb-2">{t('ideaLab.suggestedFormats')}</h3><div className="flex flex-wrap gap-2">{results.suggestedFormats.map(format => (<span key={format} className="px-3 py-1 bg-neutral-700 text-xs font-semibold rounded-full">{format}</span>))}</div></Card>
        </div>
    </div>
)};

const ViralClipResultsDisplay: React.FC<{results: ViralClipsResult, addClipToCalendar: (clip: ViralClipSuggestion) => void}> = ({ results, addClipToCalendar }) => {
    const { t } = useLocalization();
    const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

    const handleExport = () => {
        let mdContent = `# Viral Clip Finder Report\n\n`;
        mdContent += `## AI Summary\n*${results.overallSummary}*\n\n---\n\n`;
        results.clips.forEach((clip, index) => {
            mdContent += `## 💡 Potential Clip ${index + 1}: "${clip.suggestedTitle}"\n\n`;
            mdContent += `**Why it could go viral:** ${clip.viralityReason}\n\n`;
            mdContent += `**Suggested Hashtags:** ${clip.suggestedHashtags.join(' ')}\n\n`;
            mdContent += `**Visual Ideas:**\n${clip.visualIdeas.map(v => `- ${v}`).join('\n')}\n\n`;
            mdContent += `**SFX & Animations:**\n${clip.sfxAndAnimations.map(s => `- ${s}`).join('\n')}\n\n`;
            mdContent += `**Clip Script:**\n\`\`\`\n${clip.clipScript}\n\`\`\`\n\n---\n\n`;
        });
        downloadTextFile(mdContent, 'viral_clips_report.md', 'text/markdown');
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{t('ideaLab.viralClipFinder.resultsTitle')}</h3>
                <Button variant="secondary" size="sm" onClick={handleExport}>{t('ideaLab.exportReport')}</Button>
            </div>
            <div className="mb-6 p-4 bg-neutral-900 rounded-md border border-neutral-700">
                <h4 className="font-semibold text-brand-light mb-2">{t('ideaLab.viralClipFinder.overallSummary')}</h4>
                <p className="text-sm text-gray-300 italic">{results.overallSummary}</p>
            </div>
            <div className="space-y-6">
                {results.clips.map((clip, index) => (
                    <div key={index} className="p-4 bg-neutral-800 rounded-lg border border-neutral-700">
                        <div className="flex justify-between items-start gap-4">
                            <h4 className="font-bold text-lg text-white flex-grow">"{clip.suggestedTitle}"</h4>
                            <Button variant="secondary" size="sm" onClick={() => addClipToCalendar(clip)} className="flex-shrink-0">{t('ideaLab.viralClipFinder.addToCalendarShorts')}</Button>
                        </div>

                        <div className="mt-4 pt-4 border-t border-neutral-700/50 space-y-4">
                            <div>
                                <h5 className="font-semibold text-sm mb-2 text-gray-300">{t('ideaLab.viralClipFinder.viralityReason')}</h5>
                                <p className="text-sm text-gray-400 bg-neutral-900/50 p-2 rounded-md">"{clip.viralityReason}"</p>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h5 className="font-semibold text-sm text-gray-300">{t('ideaLab.viralClipFinder.clipScript')}</h5>
                                    <Button variant="secondary" size="sm" onClick={() => copyToClipboard(clip.clipScript)}>{t('ideaLab.viralClipFinder.copyScript')}</Button>
                                </div>
                                <p className="text-sm text-gray-300 max-h-32 overflow-y-auto p-3 bg-neutral-900 rounded-md whitespace-pre-wrap">{clip.clipScript}</p>
                            </div>
                            <div>
                                <h5 className="font-semibold text-sm mb-2 text-gray-300">{t('ideaLab.viralClipFinder.hashtags')}</h5>
                                <div className="flex flex-wrap gap-2">
                                    {clip.suggestedHashtags.map((tag, i) => <span key={i} className="px-2 py-0.5 bg-neutral-700 text-xs rounded-full">{tag}</span>)}
                                </div>
                            </div>
                             <div>
                                <h5 className="font-semibold text-sm mb-2 text-gray-300">{t('ideaLab.viralClipFinder.visualIdeas')}</h5>
                                <ul className="text-sm text-gray-300 list-disc list-inside space-y-1 p-3 bg-neutral-900 rounded-md">
                                    {clip.visualIdeas.map((idea, i) => <li key={i}>{idea}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h5 className="font-semibold text-sm mb-2 text-gray-300">{t('ideaLab.viralClipFinder.sfxAndAnimations')}</h5>
                                <ul className="text-sm text-gray-300 list-disc list-inside space-y-1 p-3 bg-neutral-900 rounded-md">
                                    {clip.sfxAndAnimations.map((sfx, i) => <li key={i}>{sfx}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
};

export default IdeaLab;
