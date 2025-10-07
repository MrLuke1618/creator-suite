import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { Tool, CalendarEvent, ContentStatus } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';

interface WorkflowGuideProps {
    setActiveTool: (tool: Tool) => void;
    setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
    onGenerateRelated: (topic: string) => void;
    nextIdea: CalendarEvent | undefined;
}

const WorkflowStep: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    children: React.ReactNode;
}> = ({ icon, title, description, children }) => {
    return (
        <div className="flex-1 flex flex-col p-4 bg-neutral-800/50 rounded-lg border border-neutral-700">
            <div className="flex items-center gap-3 mb-2">
                <div className="bg-brand-purple/20 p-2 rounded-full text-brand-light">
                    {icon}
                </div>
                <h3 className="font-bold text-lg">{title}</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4 flex-grow">{description}</p>
            {children}
        </div>
    );
};

const WorkflowGuide: React.FC<WorkflowGuideProps> = ({ setActiveTool, setEvents }) => {
    const { t } = useLocalization();
    const [newIdeaTitle, setNewIdeaTitle] = useState('');

    const handleQuickAdd = () => {
        if (!newIdeaTitle.trim()) return;
        const newEvent: CalendarEvent = {
            id: `idea-${Date.now()}`,
            title: newIdeaTitle,
            date: new Date().toISOString().split('T')[0],
            status: ContentStatus.IDEA,
            platform: 'YouTube'
        };
        setEvents(prev => [newEvent, ...prev]);
        setNewIdeaTitle('');
    };

    return (
        <Card>
            <h2 className="text-2xl font-bold mb-4">{t('dashboard.workflowGuide.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Step 1: Ideate */}
                <WorkflowStep
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
                    title={t('dashboard.workflowGuide.step1Title')}
                    description={t('dashboard.workflowGuide.step1Description')}
                >
                    <div className="flex flex-col gap-2 mt-auto">
                         <div className="flex gap-2">
                            <input
                                type="text"
                                value={newIdeaTitle}
                                onChange={(e) => setNewIdeaTitle(e.target.value)}
                                placeholder={t('dashboard.workflowGuide.step1Placeholder')}
                                className="w-full bg-neutral-700 border border-neutral-600 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
                            />
                            <Button onClick={handleQuickAdd} disabled={!newIdeaTitle.trim()} size="sm" className="px-3">{t('dashboard.add')}</Button>
                        </div>
                        <Button variant="secondary" onClick={() => setActiveTool(Tool.IDEA_LAB)}>{t('dashboard.workflowGuide.step1Button')}</Button>
                    </div>
                </WorkflowStep>

                {/* Step 2: Plan */}
                 <WorkflowStep
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                    title={t('dashboard.workflowGuide.step2Title')}
                    description={t('dashboard.workflowGuide.step2Description')}
                >
                    <Button variant="secondary" onClick={() => setActiveTool(Tool.CONTENT_CALENDAR)} className="mt-auto">{t('dashboard.workflowGuide.step2Button')}</Button>
                </WorkflowStep>

                 {/* Step 3: Create */}
                 <WorkflowStep
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
                    title={t('dashboard.workflowGuide.step3Title')}
                    description={t('dashboard.workflowGuide.step3Description')}
                >
                    <Button variant="secondary" onClick={() => setActiveTool(Tool.PRODUCTION_STUDIO)} className="mt-auto">{t('dashboard.workflowGuide.step3Button')}</Button>
                </WorkflowStep>

                 {/* Step 4: Analyze */}
                 <WorkflowStep
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                    title={t('dashboard.workflowGuide.step4Title')}
                    description={t('dashboard.workflowGuide.step4Description')}
                >
                    <Button variant="secondary" onClick={() => setActiveTool(Tool.ANALYTICS_HUB)} className="mt-auto">{t('dashboard.workflowGuide.step4Button')}</Button>
                </WorkflowStep>

            </div>
        </Card>
    );
};

export default WorkflowGuide;
