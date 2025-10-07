

import React, { useState, useCallback, useEffect } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { useLocalization } from '../contexts/LocalizationContext';
import { usePreset } from '../contexts/PresetContext';
import { analyzeAudienceAndEngagement, analyzeComments, analyzeScriptForBrandSafety } from '../services/geminiService';
import { AudienceAnalysisResult, CommentAnalysis, BrandSafetyAnalysis } from '../types';

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

const CommentAnalyzer: React.FC = () => {
    const { t, language } = useLocalization();
    const { activePreset, isBrandLockActive } = usePreset();
    const [comments, setComments] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<CommentAnalysis | null>(null);

    const handleAnalysis = useCallback(async () => {
        if (!comments.trim()) return;
        setIsLoading(true);
        setAnalysisResult(null);
        const result = await analyzeComments(comments, language, activePreset.context, isBrandLockActive);
        setAnalysisResult(result);
        setIsLoading(false);
    }, [comments, language, activePreset.context, isBrandLockActive]);

    const handleExport = () => {
        if (!analysisResult) return;
        let content = `--- COMMENT ANALYSIS REPORT ---\n\n`;
        content += `## OVERALL SENTIMENT\n${analysisResult.overallSentiment}\n\n`;
        content += `## COMMON THEMES\n`;
        content += analysisResult.commonThemes.map(theme => `- ${theme}`).join('\n');
        content += `\n\n## FUTURE VIDEO IDEAS\n`;
        content += analysisResult.futureVideoIdeas.map(idea => `- ${idea}`).join('\n');
        downloadTextFile(content, 'comment_analysis_report.txt');
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold">{t('analyticsHub.commentAnalyzer.title')}</h3>
                {analysisResult && (
                    <Button variant="secondary" size="sm" onClick={handleExport}>{t('analyticsHub.exportReport')}</Button>
                )}
            </div>

            <p className="text-gray-400 mb-4">{t('analyticsHub.commentAnalyzer.description')}</p>
             <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder={t('analyticsHub.commentAnalyzer.placeholder')}
                rows={8}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                disabled={isLoading}
            />
            <Button onClick={handleAnalysis} isLoading={isLoading} disabled={!comments.trim()} className="mt-4">
                {t('analyticsHub.commentAnalyzer.button')}
            </Button>

            <div className="mt-6">
                {isLoading && <p className="text-gray-400">{t('analyticsHub.commentAnalyzer.analyzing')}...</p>}
                {analysisResult && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-neutral-900">
                           <h4 className="font-semibold mb-2 text-brand-light">{t('analyticsHub.commentAnalyzer.sentimentTitle')}</h4>
                           <p>{analysisResult.overallSentiment}</p>
                        </Card>
                         <Card className="bg-neutral-900">
                           <h4 className="font-semibold mb-2 text-brand-light">{t('analyticsHub.commentAnalyzer.themesTitle')}</h4>
                           <ul className="list-disc list-inside text-sm space-y-1">
                                {analysisResult.commonThemes.map((theme, i) => <li key={i}>{theme}</li>)}
                           </ul>
                        </Card>
                         <Card className="bg-neutral-900">
                           <h4 className="font-semibold mb-2 text-brand-light">{t('analyticsHub.commentAnalyzer.ideasTitle')}</h4>
                            <ul className="list-disc list-inside text-sm space-y-1">
                                {analysisResult.futureVideoIdeas.map((idea, i) => <li key={i}>{idea}</li>)}
                           </ul>
                        </Card>
                    </div>
                )}
            </div>
        </Card>
    )
}

interface AnalyticsHubProps {
  scriptFromStudio: string;
}

const AnalyticsHub: React.FC<AnalyticsHubProps> = ({ scriptFromStudio }) => {
  const { t, language } = useLocalization();
  const { activePreset, isBrandLockActive } = usePreset();
  const [manualScript, setManualScript] = useState('');
  const [isAutoMode, setIsAutoMode] = useState(!!scriptFromStudio);
  
  const [isLoadingAudience, setIsLoadingAudience] = useState(false);
  const [audienceResult, setAudienceResult] = useState<AudienceAnalysisResult | null>(null);

  const [isLoadingSafety, setIsLoadingSafety] = useState(false);
  const [safetyResult, setSafetyResult] = useState<BrandSafetyAnalysis | null>(null);

  useEffect(() => {
    if (!scriptFromStudio) {
      setIsAutoMode(false);
    }
  }, [scriptFromStudio]);

  const handleAudienceAnalysis = useCallback(async () => {
    const scriptToAnalyze = isAutoMode ? scriptFromStudio : manualScript;
    if (!scriptToAnalyze.trim()) return;
    setIsLoadingAudience(true);
    setAudienceResult(null);
    const result = await analyzeAudienceAndEngagement(scriptToAnalyze, language, activePreset.context, isBrandLockActive);
    setAudienceResult(result);
    setIsLoadingAudience(false);
  }, [isAutoMode, scriptFromStudio, manualScript, language, activePreset.context, isBrandLockActive]);

  const handleSafetyAnalysis = useCallback(async () => {
    const scriptToAnalyze = isAutoMode ? scriptFromStudio : manualScript;
    if (!scriptToAnalyze.trim()) return;
    setIsLoadingSafety(true);
    setSafetyResult(null);
    const result = await analyzeScriptForBrandSafety(scriptToAnalyze, language, activePreset.context, isBrandLockActive);
    setSafetyResult(result);
    setIsLoadingSafety(false);
  }, [isAutoMode, scriptFromStudio, manualScript, language, activePreset.context, isBrandLockActive]);


  const handleExportAudience = () => {
    if (!audienceResult) return;
    let content = `--- PRE-PRODUCTION ANALYSIS REPORT ---\n\n`;
    content += `## PREDICTED AUDIENCE DEMOGRAPHICS\n`;
    content += `Age Range: ${audienceResult.predictedDemographics.ageRange}\n`;
    content += `Key Interests: ${audienceResult.predictedDemographics.interests.join(', ')}\n\n`;
    content += `## ENGAGEMENT ANALYSIS\n`;
    content += `Predicted Sentiment: ${audienceResult.engagementAnalysis.predictedSentiment}\n`;
    content += `Emotional Triggers: ${audienceResult.engagementAnalysis.emotionalTriggers.join(', ')}\n\n`;
    content += `## ENGAGEMENT-BOOSTING QUESTIONS\n`;
    content += audienceResult.suggestedQuestions.map(q => `- ${q}`).join('\n');
    content += `\n\n## AUTOMATED COMMENT REPLIES\n`;
    content += audienceResult.automatedCommentReplies.map(r => `- "${r}"`).join('\n');
    downloadTextFile(content, 'audience_analysis_report.txt');
  };

  const handleExportSafety = () => {
    if (!safetyResult) return;
    let content = `--- BRAND SAFETY & TONE ANALYSIS REPORT ---\n\n`;
    content += `## OVERALL TONE\n${safetyResult.overallTone}\n\n`;
    content += `## BRAND SAFETY SUMMARY\n${safetyResult.brandSafetySummary}\n\n`;
    content += `## POTENTIAL ISSUES\n`;
    if (safetyResult.potentialIssues.length > 0) {
      content += safetyResult.potentialIssues.map(issue => 
        `- [${issue.issueType}] "${issue.quote}"\n  Reason: ${issue.explanation}`
      ).join('\n\n');
    } else {
      content += 'No potential issues were found.';
    }
    downloadTextFile(content, 'brand_safety_report.txt');
  };

  const isAnalyzeDisabled = isLoadingAudience || isLoadingSafety || (isAutoMode ? !scriptFromStudio.trim() : !manualScript.trim());

  return (
    <div className="space-y-8">
      <Card>
        <h2 className="text-2xl font-bold mb-2">{t('analyticsHub.title')}</h2>
        <p className="text-gray-400 mb-6">{t('analyticsHub.description')}</p>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg border border-neutral-700">
              <div>
                  <h4 className="font-semibold text-brand-light">Auto Mode</h4>
                  <p className="text-xs text-gray-400 mt-1">When enabled, this tool will automatically use the script from the Production Studio.</p>
              </div>
              <label htmlFor="auto-mode-toggle" className="flex items-center cursor-pointer">
                  <div className="relative">
                      <input 
                          type="checkbox" 
                          id="auto-mode-toggle" 
                          className="sr-only" 
                          checked={isAutoMode} 
                          onChange={() => setIsAutoMode(!isAutoMode)} 
                          disabled={!scriptFromStudio}
                      />
                      <div className={`block w-14 h-8 rounded-full transition-colors ${isAutoMode ? 'bg-brand-purple' : 'bg-neutral-600'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ease-in-out ${isAutoMode ? 'transform translate-x-full' : ''}`}></div>
                  </div>
              </label>
          </div>
          <div>
            <label htmlFor="script-input" className="block text-sm font-medium text-gray-300 mb-2">
              {t('analyticsHub.inputLabel')}
            </label>
            <textarea
              id="script-input"
              value={isAutoMode ? scriptFromStudio : manualScript}
              onChange={(e) => setManualScript(e.target.value)}
              placeholder={isAutoMode && scriptFromStudio ? t('analyticsHub.placeholderAuto') : t('analyticsHub.placeholder')}
              rows={10}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-brand-purple disabled:bg-neutral-900 disabled:text-gray-500"
              disabled={isAutoMode}
            />
          </div>
        </div>
      </Card>
      
      {/* --- AUDIENCE ANALYSIS --- */}
      <Card>
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">{t('analyticsHub.audienceAnalyzer.title')}</h2>
            <p className="text-gray-400 mb-4 max-w-2xl">{t('analyticsHub.audienceAnalyzer.description')}</p>
          </div>
          <Button onClick={handleAudienceAnalysis} isLoading={isLoadingAudience} disabled={isAnalyzeDisabled}>
            {t('analyticsHub.audienceAnalyzer.button')}
          </Button>
        </div>

        <div className="mt-6">
          {isLoadingAudience && <p className="text-gray-400 text-center py-8">{t('analyticsHub.analyzing')}...</p>}
          {!isLoadingAudience && !audienceResult && (
            <div className="text-center py-12 border-2 border-dashed border-neutral-700 rounded-lg">
              <p className="text-gray-500 max-w-md mx-auto">{t('analyticsHub.initialPrompt')}</p>
            </div>
          )}
          {audienceResult && (
            <div>
              <div className="flex justify-end mb-4">
                  <Button variant="secondary" size="sm" onClick={handleExportAudience}>{t('analyticsHub.exportReport')}</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-neutral-900"><h4 className="font-semibold mb-3 text-brand-light">{t('analyticsHub.demographicsTitle')}</h4><div className="space-y-2 text-sm"><p><span className="font-semibold">{t('analyticsHub.ageRange')}:</span> {audienceResult.predictedDemographics.ageRange}</p><div><p className="font-semibold mb-1">{t('analyticsHub.interests')}:</p><div className="flex flex-wrap gap-1">{audienceResult.predictedDemographics.interests.map((interest, i) => (<span key={i} className="px-2 py-0.5 bg-neutral-700 text-xs rounded-full">{interest}</span>))}</div></div></div></Card>
                <Card className="bg-neutral-900"><h4 className="font-semibold mb-3 text-brand-light">{t('analyticsHub.engagementTitle')}</h4><div className="space-y-2 text-sm"><p><span className="font-semibold">{t('analyticsHub.sentiment')}:</span> {audienceResult.engagementAnalysis.predictedSentiment}</p><div><p className="font-semibold mb-1">{t('analyticsHub.triggers')}:</p><div className="flex flex-wrap gap-1">{audienceResult.engagementAnalysis.emotionalTriggers.map((trigger, i) => (<span key={i} className="px-2 py-0.5 bg-neutral-700 text-xs rounded-full">{trigger}</span>))}</div></div></div></Card>
                <Card className="bg-neutral-900"><h4 className="font-semibold mb-3 text-brand-light">{t('analyticsHub.questionsTitle')}</h4><ul className="space-y-2 list-disc list-inside text-sm">{audienceResult.suggestedQuestions.map((q, i) => <li key={i}>{q}</li>)}</ul></Card>
                <Card className="bg-neutral-900"><h4 className="font-semibold mb-3 text-brand-light">{t('analyticsHub.automatedRepliesTitle')}</h4><div className="space-y-3">{audienceResult.automatedCommentReplies.map((reply, i) => (<div key={i} className="flex items-center justify-between p-2 bg-neutral-800 rounded-md text-sm gap-2"><p className="italic flex-grow">"{reply}"</p><button onClick={() => navigator.clipboard.writeText(reply)} className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-neutral-700 transition-colors flex-shrink-0" title={t('productionStudio.copy')}><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button></div>))}</div></Card>
              </div>
            </div>
          )}
        </div>
      </Card>
      
      {/* --- BRAND SAFETY ANALYSIS --- */}
      <Card>
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">{t('analyticsHub.brandSafetyAnalyzer.title')}</h2>
            <p className="text-gray-400 mb-4 max-w-2xl">{t('analyticsHub.brandSafetyAnalyzer.description')}</p>
          </div>
          <Button onClick={handleSafetyAnalysis} isLoading={isLoadingSafety} disabled={isAnalyzeDisabled}>
            {t('analyticsHub.brandSafetyAnalyzer.button')}
          </Button>
        </div>
        
        <div className="mt-6">
          {isLoadingSafety && <p className="text-gray-400 text-center py-8">{t('analyticsHub.brandSafetyAnalyzer.analyzing')}...</p>}
          {!isLoadingSafety && !safetyResult && (
            <div className="text-center py-12 border-2 border-dashed border-neutral-700 rounded-lg">
              <p className="text-gray-500 max-w-md mx-auto">{t('analyticsHub.brandSafetyAnalyzer.initialPrompt')}</p>
            </div>
          )}
          {safetyResult && (
            <div>
              <div className="flex justify-end mb-4">
                <Button variant="secondary" size="sm" onClick={handleExportSafety}>{t('analyticsHub.exportReport')}</Button>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-neutral-900"><h4 className="font-semibold mb-2 text-brand-light">{t('analyticsHub.brandSafetyAnalyzer.overallTone')}</h4><p>{safetyResult.overallTone}</p></Card>
                  <Card className="bg-neutral-900"><h4 className="font-semibold mb-2 text-brand-light">{t('analyticsHub.brandSafetyAnalyzer.safetySummary')}</h4><p>{safetyResult.brandSafetySummary}</p></Card>
                </div>
                {safetyResult.potentialIssues.length > 0 && (
                  <Card className="bg-neutral-900">
                    <h4 className="font-semibold mb-3 text-brand-light">{t('analyticsHub.brandSafetyAnalyzer.potentialIssues')}</h4>
                    <div className="space-y-3">
                      {safetyResult.potentialIssues.map((issue, i) => (
                        <div key={i} className="p-3 border border-neutral-700 rounded-md">
                           <p className="italic text-gray-300">"{issue.quote}"</p>
                           <div className="flex items-center gap-4 mt-2 text-xs">
                             <span className="px-2 py-0.5 bg-yellow-800 text-yellow-200 rounded-full font-semibold">{issue.issueType}</span>
                             <p className="text-gray-400">{issue.explanation}</p>
                           </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="border-t-2 border-dashed border-neutral-700"></div>
      
      <CommentAnalyzer />
    </div>
  );
};

export default AnalyticsHub;
