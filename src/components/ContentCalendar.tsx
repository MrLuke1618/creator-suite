import React, { useState, useMemo, useCallback, useRef } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { CalendarEvent, ContentStatus } from '../types';
import { generateContentIdeas } from '../services/geminiService';
import { useLocalization } from '../contexts/LocalizationContext';
import EventModal from './EventModal';

const statusColors: Record<ContentStatus, string> = {
  [ContentStatus.IDEA]: 'bg-blue-600/50 border-blue-500',
  [ContentStatus.SCRIPTING]: 'bg-yellow-600/50 border-yellow-500',
  [ContentStatus.FILMING]: 'bg-purple-600/50 border-purple-500',
  [ContentStatus.EDITING]: 'bg-orange-600/50 border-orange-500',
  [ContentStatus.PUBLISHED]: 'bg-green-600/50 border-green-500',
};

interface ContentCalendarProps {
    events: CalendarEvent[];
    setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
}

const ContentCalendar: React.FC<ContentCalendarProps> = ({ events, setEvents }) => {
  const { t, language } = useLocalization();
  const [currentDate, setCurrentDate] = useState(new Date());

  const [ideaTopic, setIdeaTopic] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<CalendarEvent['platform']>('YouTube');
  const [isGenerating, setIsGenerating] = useState(false);
  const [draggedEventId, setDraggedEventId] = useState<string | null>(null);
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [currentDate]);

  const firstDayOfMonth = useMemo(() => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleGenerateIdeas = useCallback(async () => {
    if (!ideaTopic.trim()) return;
    setIsGenerating(true);
    const result = await generateContentIdeas(ideaTopic, language);
    if (result.ideas && Array.isArray(result.ideas)) {
        const newEvents: CalendarEvent[] = result.ideas.map((idea, index) => ({
            id: `idea-${Date.now()}-${index}`,
            title: idea.title || 'Untitled Idea',
            date: new Date().toISOString().split('T')[0], // Today's date
            status: ContentStatus.IDEA,
            platform: selectedPlatform
        }));
        setEvents(prev => [...prev, ...newEvents]);
    }
    setIsGenerating(false);
    setIdeaTopic('');
  }, [ideaTopic, setEvents, selectedPlatform, language]);

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, eventId: string) => {
    setDraggedEventId(eventId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onDragEnd = () => {
    setDraggedEventId(null);
    setDragOverDate(null);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, date: Date) => {
    e.preventDefault();
    if (!draggedEventId) return;

    setEvents(prevEvents => prevEvents.map(event => 
      event.id === draggedEventId
        ? { ...event, date: date.toISOString().split('T')[0] }
        : event
    ));
    onDragEnd();
  };

    const handleExport = () => {
        const headers = ['id', 'title', 'date', 'status', 'platform'];
        const csvRows = [
            headers.join(','),
            ...events.map(event => 
                [event.id, `"${event.title.replace(/"/g, '""')}"`, event.date, event.status, event.platform].join(',')
            )
        ];
        const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "content_calendar.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const csvText = event.target?.result as string;
            if (!csvText) return;

            try {
                const lines = csvText.split('\n').map(row => row.trim()).filter(Boolean);
                if (lines.length < 2) {
                    alert("CSV file must have a header and at least one data row.");
                    return;
                }

                const header = lines[0].split(',').map(h => h.trim().toLowerCase());
                const requiredHeaders = ['id', 'title', 'date', 'status', 'platform'];
                
                if (!requiredHeaders.every(h => header.includes(h))) {
                    alert('Invalid CSV format. Header must contain: ' + requiredHeaders.join(', '));
                    return;
                }
                
                const idIndex = header.indexOf('id');
                const titleIndex = header.indexOf('title');
                const dateIndex = header.indexOf('date');
                const statusIndex = header.indexOf('status');
                const platformIndex = header.indexOf('platform');

                const newOrUpdatedEvents = lines.slice(1).map(line => {
                    const values = line.split(',');
                    return {
                        id: values[idIndex]?.trim(),
                        title: values[titleIndex]?.trim().replace(/^"|"$/g, ''),
                        date: values[dateIndex]?.trim(),
                        status: values[statusIndex]?.trim(),
                        platform: values[platformIndex]?.trim()
                    }
                });

                setEvents(prevEvents => {
                    const eventsMap = new Map(prevEvents.map(e => [e.id, e]));
                    
                    newOrUpdatedEvents.forEach(item => {
                        if (item.id && item.title && item.date && item.status && item.platform) {
                            if (Object.values(ContentStatus).includes(item.status as ContentStatus)) {
                                 eventsMap.set(item.id, {
                                    id: item.id,
                                    title: item.title,
                                    date: item.date,
                                    status: item.status as ContentStatus,
                                    platform: item.platform as CalendarEvent['platform']
                                });
                            } else {
                                console.warn(`Skipping event with invalid status: ${item.status}`);
                            }
                        } else {
                            console.warn('Skipping incomplete event row:', item);
                        }
                    });
                    return Array.from(eventsMap.values());
                });

            } catch (error) {
                console.error("Error parsing CSV:", error);
                alert("Failed to parse CSV file. Please check the format.");
            } finally {
                if (e.target) e.target.value = '';
            }
        };
        reader.readAsText(file);
    };

  const handleDayClick = (date: Date) => {
    setSelectedEvent(null);
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedDate(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedDate(null);
  };

  const handleSaveEvent = (eventToSave: CalendarEvent) => {
    setEvents(prevEvents => {
      const eventExists = prevEvents.some(e => e.id === eventToSave.id);
      if (eventExists) {
        return prevEvents.map(e => (e.id === eventToSave.id ? eventToSave : e));
      } else {
        return [...prevEvents, eventToSave];
      }
    });
    handleCloseModal();
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prevEvents => prevEvents.filter(e => e.id !== eventId));
    handleCloseModal();
  };

  const weekdays = useMemo(() => t('calendar.weekdaysShort').split(','), [t]);

  return (
    <>
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <Button onClick={handlePrevMonth} className="flex-shrink-0">{t('calendar.prevMonth')}</Button>
                    <h2 className="text-xl sm:text-2xl font-bold text-center flex-grow mx-2">{currentDate.toLocaleString(language, { month: 'long', year: 'numeric' })}</h2>
                    <Button onClick={handleNextMonth} className="flex-shrink-0">{t('calendar.nextMonth')}</Button>
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {weekdays.map(day => <div key={day} className="text-center font-semibold text-gray-400 text-xs sm:text-sm py-2">{day}</div>)}
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`}></div>)}
                    {daysInMonth.map(day => {
                        const dateStr = day.toISOString().split('T')[0];
                        const dayEvents = events.filter(e => e.date === dateStr);
                        const isDragOver = dragOverDate === dateStr;

                        return (
                            <div key={day.toString()} 
                                className={`border h-28 sm:h-32 md:h-36 rounded-md p-1 flex flex-col transition-colors duration-200 ease-in-out cursor-pointer
                                  ${isDragOver ? 'bg-brand-purple/20 border-brand-purple' : 'border-neutral-700 bg-neutral-800/50 hover:bg-neutral-700/50'}`}
                                onDragOver={onDragOver}
                                onDrop={(e) => onDrop(e, day)}
                                onDragEnter={() => setDragOverDate(dateStr)}
                                onDragLeave={() => setDragOverDate(null)}
                                onClick={() => handleDayClick(day)}
                                >
                                <span className="text-xs text-gray-400">{day.getDate()}</span>
                                <div className="flex-grow overflow-y-auto space-y-1 mt-1 scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-transparent">
                                    {dayEvents.map(event => (
                                        <div key={event.id}
                                            draggable
                                            onDragStart={(e) => onDragStart(e, event.id)}
                                            onDragEnd={onDragEnd}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEventClick(event);
                                            }}
                                            className={`p-1.5 rounded-md text-xs cursor-pointer border transition-all duration-200 ease-in-out ${statusColors[event.status]} 
                                              ${draggedEventId === event.id ? 'opacity-50 scale-95 shadow-2xl' : 'hover:scale-105 hover:shadow-md'}`}>
                                            <p className="font-bold truncate">{event.title}</p>
                                            <p className="text-gray-300">{event.platform}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>
        <div className="lg:col-span-1">
            <Card className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold">{t('calendar.contentTools')}</h2>
                <div>
                    <h3 className="text-lg font-semibold mb-2">{t('calendar.generateIdeas')}</h3>
                    <div className="space-y-2">
                        <input 
                            type="text" 
                            value={ideaTopic}
                            onChange={(e) => setIdeaTopic(e.target.value)}
                            placeholder={t('calendar.topicPlaceholder')}
                            className="w-full bg-neutral-700 border border-neutral-600 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
                        />
                        <div>
                            <label htmlFor="platform-select-calendar" className="text-sm font-medium text-gray-300 mb-1 block">{t('calendar.platform')}</label>
                            <select
                                id="platform-select-calendar"
                                value={selectedPlatform}
                                onChange={(e) => setSelectedPlatform(e.target.value as CalendarEvent['platform'])}
                                className="w-full bg-neutral-700 border border-neutral-600 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
                            >
                                <option value="YouTube">YouTube</option>
                                <option value="YouTube Shorts">YouTube Shorts</option>
                                <option value="TikTok">TikTok</option>
                                <option value="Instagram">Instagram</option>
                            </select>
                        </div>
                    </div>
                    <Button onClick={handleGenerateIdeas} isLoading={isGenerating} disabled={!ideaTopic.trim()} className="w-full mt-2">
                        {t('calendar.generateWithAI')}
                    </Button>
                </div>
                 <div>
                    <h3 className="text-lg font-semibold mb-2">{t('calendar.actions')}</h3>
                    <div className="flex flex-col gap-2">
                        <Button onClick={handleExport} variant="secondary" className="w-full">{t('calendar.export')}</Button>
                        <Button onClick={handleUploadClick} variant="secondary" className="w-full">{t('calendar.uploadEvents')}</Button>
                         <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".csv"
                            className="hidden"
                        />
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2">{t('calendar.statusKey')}</h3>
                    <div className="space-y-1">
                        {Object.entries(statusColors).map(([status, className]) => (
                            <div key={status} className="flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-full ${className.split(' ')[0]}`}></span>
                                <span className="text-sm">{t(`contentStatuses.${status}`)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    </div>
    <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        event={selectedEvent}
        date={selectedDate}
    />
    </>
  );
};

export default ContentCalendar;