import React from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { Tool, CalendarEvent, ContentStatus, Task, TaskPriority, Preset } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';
import { usePreset } from '../contexts/PresetContext';
import WorkflowGuide from './WorkflowGuide';
import TaskModal from './TaskModal';

interface DashboardProps {
  setActiveTool: (tool: Tool) => void;
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onGenerateRelated: (topic: string) => void;
}

const priorityConfig: Record<TaskPriority, { color: string; label: string }> = {
  [TaskPriority.HIGH]: { color: 'bg-red-500', label: 'High' },
  [TaskPriority.MEDIUM]: { color: 'bg-yellow-500', label: 'Medium' },
  [TaskPriority.LOW]: { color: 'bg-green-500', label: 'Low' },
};

const PresetManager: React.FC = () => {
    const { t } = useLocalization();
    const { activePreset, allPresets, setActivePresetId, addPreset, isBrandLockActive } = usePreset();
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleDownloadTemplate = () => {
        const template: Preset = {
          id: 'your-company-id',
          name: 'Your Company Name',
          context: `This is where you describe your company.
- Brand voice: (e.g., professional, playful, witty)
- Target Audience: (e.g., Shopify merchants, indie gamers, home cooks)
- Products/Services: List your key offerings with brief descriptions.
- - Product A: Does this.
- - Product B: Does that.
- Unique Selling Proposition: What makes you different?`,
        };
        const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = 'preset_template.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    };

    const handleExportPreset = () => {
        if (activePreset.id === 'none') {
            alert(t('dashboard.presetManager.exportError'));
            return;
        }
        const sanitizedName = activePreset.name.toLowerCase().replace(/\s+/g, '_');
        const blob = new Blob([JSON.stringify(activePreset, null, 2)], { type: 'application/json' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = `preset_${sanitizedName}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const content = event.target?.result as string;
                const newPreset = JSON.parse(content);
                if (addPreset(newPreset)) {
                    setActivePresetId(newPreset.id);
                    alert(t('dashboard.presetManager.importSuccess').replace('{presetName}', newPreset.name));
                } else {
                    alert(t('dashboard.presetManager.importErrorMalformed'));
                }
            } catch (error) {
                console.error("Error importing preset:", error);
                alert(t('dashboard.presetManager.importErrorParse'));
            } finally {
                if (e.target) e.target.value = '';
            }
        };
        reader.readAsText(file);
    };

    return (
        <Card>
            <h2 className="text-2xl font-bold mb-4">{t('dashboard.presetManager.title')}</h2>
            <p className="text-gray-400 text-sm mb-4">{t('dashboard.presetManager.description')}</p>
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label htmlFor="preset-select" className="block text-sm font-medium text-gray-300">{t('dashboard.presetManager.activePreset')}</label>
                         {isBrandLockActive && (
                            <div className="flex items-center gap-2 text-sm text-violet-300 bg-brand-purple/20 border border-brand-purple/50 px-3 py-1 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>
                                <span>{t('dashboard.presetManager.brandLockActive')}</span>
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <select
                            id="preset-select"
                            value={activePreset.id}
                            onChange={(e) => setActivePresetId(e.target.value)}
                            className="w-full bg-neutral-700 border border-neutral-600 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple appearance-none"
                            aria-label={t('dashboard.presetManager.selectAriaLabel')}
                        >
                            {allPresets.map(preset => (
                                <option key={preset.id} value={preset.id}>{preset.name}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                           <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Button onClick={handleImportClick} variant="secondary" className="w-full">{t('dashboard.presetManager.importButton')}</Button>
                    <Button onClick={handleExportPreset} variant="secondary" className="w-full" disabled={activePreset.id === 'none'}>{t('dashboard.presetManager.exportButton')}</Button>
                    <Button onClick={handleDownloadTemplate} variant="secondary" className="w-full">{t('dashboard.presetManager.downloadTemplateButton')}</Button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json" />
                </div>
            </div>
        </Card>
    );
};


const TaskManager: React.FC<{tasks: Task[], setTasks: React.Dispatch<React.SetStateAction<Task[]>>}> = ({ tasks, setTasks }) => {
    const { t } = useLocalization();
    const [newTaskText, setNewTaskText] = React.useState('');
    const [newTaskPriority, setNewTaskPriority] = React.useState<TaskPriority>(TaskPriority.MEDIUM);
    const [sortByPriority, setSortByPriority] = React.useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false);
    const [editingTask, setEditingTask] = React.useState<Task | null>(null);

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskText.trim()) return;
        const newTask: Task = {
            id: Date.now(),
            text: newTaskText.trim(),
            completed: false,
            priority: newTaskPriority,
        };
        setTasks(prev => [...prev, newTask]);
        setNewTaskText('');
        setNewTaskPriority(TaskPriority.MEDIUM);
    };

    const handleExportTasks = () => {
        const headers = ['id', 'text', 'completed', 'priority', 'deadline'];
        const csvRows = [
            headers.join(','),
            ...tasks.map(task => 
                [
                    task.id,
                    `"${task.text.replace(/"/g, '""')}"`, // Handle quotes
                    task.completed,
                    task.priority,
                    task.deadline || ''
                ].join(',')
            )
        ];
        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "my_tasks.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleToggleTask = (taskId: number) => {
        setTasks(prev => prev.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
        ));
    };

    const handleOpenEditModal = (task: Task) => {
        setEditingTask(task);
        setIsTaskModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditingTask(null);
        setIsTaskModalOpen(false);
    };

    const handleSaveTask = (updatedTask: Task) => {
        setTasks(prev => prev.map(task => (task.id === updatedTask.id ? updatedTask : task)));
        handleCloseEditModal();
    };
    
    const handleDeleteTask = (taskId: number) => {
        setTasks(prev => prev.filter(task => task.id !== taskId));
    };
    
    const sortedTasks = React.useMemo(() => {
        const priorityOrder = { [TaskPriority.HIGH]: 1, [TaskPriority.MEDIUM]: 2, [TaskPriority.LOW]: 3 };
        const tasksCopy = [...tasks];
        if (sortByPriority) {
            tasksCopy.sort((a, b) => {
                if (a.completed !== b.completed) {
                    return a.completed ? 1 : -1;
                }
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            });
        }
        return tasksCopy;
    }, [tasks, sortByPriority]);


    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{t('dashboard.myTasks')}</h2>
               <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={handleExportTasks} disabled={tasks.length === 0}>
                       {t('dashboard.exportTasks')}
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => setSortByPriority(!sortByPriority)}>
                        {sortByPriority ? t('dashboard.unsort') : t('dashboard.sortByPriority')}
                    </Button>
                </div>
            </div>
            <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-2 mb-4">
                <input
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder={t('dashboard.addTaskPlaceholder')}
                    className="w-full bg-neutral-700 border border-neutral-600 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
                />
                <select 
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                    className="bg-neutral-700 border border-neutral-600 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple flex-shrink-0"
                >
                    <option value={TaskPriority.LOW}>{t('dashboard.lowPriority')}</option>
                    <option value={TaskPriority.MEDIUM}>{t('dashboard.mediumPriority')}</option>
                    <option value={TaskPriority.HIGH}>{t('dashboard.highPriority')}</option>
                </select>
                <Button type="submit" disabled={!newTaskText.trim()} className="flex-shrink-0">{t('dashboard.add')}</Button>
            </form>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {sortedTasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between gap-2 p-2 bg-neutral-900 rounded-md hover:bg-neutral-800 transition-colors group">
                        <div className="flex items-center gap-3 flex-grow cursor-pointer" onClick={() => handleOpenEditModal(task)}>
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => handleToggleTask(task.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="h-5 w-5 rounded bg-neutral-700 border-neutral-600 text-brand-purple focus:ring-brand-purple cursor-pointer flex-shrink-0"
                            />
                            <span className={`w-3 h-3 rounded-full ${priorityConfig[task.priority].color} flex-shrink-0`}></span>
                            <span className={`flex-grow text-sm ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                {task.text}
                            </span>
                        </div>
                        <button 
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                            aria-label={`Delete task ${task.text}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                ))}
                 {tasks.length === 0 && (
                    <div className="text-center p-4 border-2 border-dashed border-neutral-700 rounded-md">
                        <p className="text-sm text-gray-500">{t('dashboard.noTasks')}</p>
                    </div>
                 )}
            </div>
             <TaskModal
                isOpen={isTaskModalOpen}
                onClose={handleCloseEditModal}
                onSave={handleSaveTask}
                task={editingTask}
            />
        </Card>
    )
}


const Dashboard: React.FC<DashboardProps> = ({ setActiveTool, events, setEvents, tasks, setTasks, onGenerateRelated }) => {
  const { t } = useLocalization();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t('dashboard.welcome')}</h1>
        <p className="text-gray-400">{t('dashboard.commandCenter')}</p>
      </div>

      <PresetManager />

      <WorkflowGuide 
        setActiveTool={setActiveTool} 
        setEvents={setEvents} 
        onGenerateRelated={onGenerateRelated}
        nextIdea={events.find(e => e.status === ContentStatus.IDEA)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <TaskManager tasks={tasks} setTasks={setTasks} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;