
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import IdeaLab from './components/BrainstormingHub'; // Renamed component, filename kept for simplicity
import ProductionStudio from './components/ContentOptimizer'; // Repurposed component for the new studio
import ContentCalendar from './components/ContentCalendar';
import VideoLab from './components/VideoLab';
import AnalyticsHub from './components/AnalyticsHub';
import HelpModal from './components/HelpModal';
import Footer from './components/Footer';
import { Tool, CalendarEvent, ContentStatus, Task, TaskPriority } from './types';
import { LocalizationProvider } from './contexts/LocalizationContext';
import { PresetProvider } from './contexts/PresetContext';

const initialEvents: CalendarEvent[] = [
    {id: '1', title: 'Unboxing New Camera', date: '2024-07-15', status: ContentStatus.PUBLISHED, platform: 'YouTube'},
    {id: '2', title: 'Top 5 Editing Tricks', date: '2024-07-22', status: ContentStatus.SCRIPTING, platform: 'YouTube'},
    {id: '3', title: 'Quick TikTok transition', date: '2024-07-25', status: ContentStatus.IDEA, platform: 'TikTok'},
    {id: '4', title: 'The Future of AI', date: '2024-07-28', status: ContentStatus.FILMING, platform: 'YouTube'},
    {id: '5', title: 'My Desk Setup Tour', date: '2024-08-02', status: ContentStatus.EDITING, platform: 'YouTube'},
    {id: '6', title: 'How to grow on TikTok', date: '2024-07-29', status: ContentStatus.IDEA, platform: 'TikTok'},
];

const initialTasks: Task[] = [
    { id: 1, text: 'Outline Q3 video strategy', completed: false, priority: TaskPriority.HIGH },
    { id: 2, text: 'Research new microphone', completed: true, priority: TaskPriority.MEDIUM },
    { id: 3, text: 'Schedule collab with @creator', completed: false, priority: TaskPriority.LOW },
    { id: 4, text: 'Finalize editing for "Future of AI"', completed: false, priority: TaskPriority.HIGH },
    { id: 5, text: 'Reply to sponsorship emails', completed: false, priority: TaskPriority.MEDIUM },
];

const AppContent: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool>(Tool.DASHBOARD);
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [showHelp, setShowHelp] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [ideaLabSeedTopic, setIdeaLabSeedTopic] = useState<string>('');
  const [script, setScript] = useState<string>('');

  useEffect(() => {
    try {
        const storedTasks = localStorage.getItem('creator-suite-tasks');
        if (storedTasks) {
            setTasks(JSON.parse(storedTasks));
        } else {
            setTasks(initialTasks);
        }
    } catch (error) {
        console.error("Failed to load tasks from localStorage", error);
        setTasks(initialTasks);
    }
  }, []);

  useEffect(() => {
    try {
        localStorage.setItem('creator-suite-tasks', JSON.stringify(tasks));
    } catch (error) {
        console.error("Failed to save tasks to localStorage", error);
    }
  }, [tasks]);

  const handleGenerateRelated = useCallback((topic: string) => {
    setIdeaLabSeedTopic(topic);
    setActiveTool(Tool.IDEA_LAB);
  }, []);

  const handleSeedTopicUsed = useCallback(() => {
    setIdeaLabSeedTopic('');
  }, []);


  const renderActiveTool = useCallback(() => {
    switch (activeTool) {
      case Tool.DASHBOARD:
        return <Dashboard 
            setActiveTool={setActiveTool} 
            events={events} 
            setEvents={setEvents} 
            tasks={tasks}
            setTasks={setTasks}
            onGenerateRelated={handleGenerateRelated}
        />;
      case Tool.IDEA_LAB:
        return <IdeaLab 
            setEvents={setEvents} 
            seedTopic={ideaLabSeedTopic} 
            onSeedTopicUsed={handleSeedTopicUsed} 
        />;
      case Tool.PRODUCTION_STUDIO:
        return <ProductionStudio script={script} setScript={setScript} />;
      case Tool.VIDEO_LAB:
        return <VideoLab />;
       case Tool.ANALYTICS_HUB:
        return <AnalyticsHub scriptFromStudio={script} />;
      case Tool.CONTENT_CALENDAR:
        return <ContentCalendar events={events} setEvents={setEvents} />;
      default:
        return <Dashboard 
            setActiveTool={setActiveTool} 
            events={events} 
            setEvents={setEvents}
            tasks={tasks}
            setTasks={setTasks}
            onGenerateRelated={handleGenerateRelated}
        />;
    }
  }, [activeTool, events, tasks, script, handleGenerateRelated, handleSeedTopicUsed]);

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 font-sans flex flex-col">
      <Header activeTool={activeTool} setActiveTool={setActiveTool} onHelpClick={() => setShowHelp(true)} />
      <main className="p-4 sm:p-6 md:p-8 flex-grow">
        {renderActiveTool()}
      </main>
      <Footer />
      {showHelp && <HelpModal tool={activeTool} onClose={() => setShowHelp(false)} />}
    </div>
  );
};


const App: React.FC = () => {
    return (
        <PresetProvider>
            <LocalizationProvider>
                <AppContent />
            </LocalizationProvider>
        </PresetProvider>
    );
}

export default App;
