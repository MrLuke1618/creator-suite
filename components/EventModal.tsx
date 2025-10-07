import React, { useState, useEffect } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { CalendarEvent, ContentStatus } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
  event: CalendarEvent | null;
  date: Date | null;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, onDelete, event, date }) => {
  const { t } = useLocalization();
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<ContentStatus>(ContentStatus.IDEA);
  const [platform, setPlatform] = useState<CalendarEvent['platform']>('YouTube');

  useEffect(() => {
    if (!isOpen) return;
    if (event) {
      setTitle(event.title);
      setStatus(event.status);
      setPlatform(event.platform);
    } else {
      // Reset for new event
      setTitle('');
      setStatus(ContentStatus.IDEA);
      setPlatform('YouTube');
    }
  }, [event, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim()) return;
    const finalDate = event ? event.date : date!.toISOString().split('T')[0];
    const savedEvent: CalendarEvent = {
      id: event?.id || `event-${Date.now()}`,
      title: title.trim(),
      date: finalDate,
      status,
      platform,
    };
    onSave(savedEvent);
  };

  const handleDelete = () => {
    if (event) {
      onDelete(event.id);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <Card className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">{event ? t('eventModal.editTitle') : t('eventModal.addTitle')}</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="event-title" className="block text-sm font-medium text-gray-300 mb-1">{t('eventModal.titleLabel')}</label>
            <input
              id="event-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral-700 border border-neutral-600 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
            />
          </div>
          <div>
            <label htmlFor="event-status" className="block text-sm font-medium text-gray-300 mb-1">{t('eventModal.statusLabel')}</label>
            <select
              id="event-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as ContentStatus)}
              className="w-full bg-neutral-700 border border-neutral-600 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
            >
              {Object.values(ContentStatus).map(s => <option key={s} value={s}>{t(`contentStatuses.${s}`)}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="event-platform" className="block text-sm font-medium text-gray-300 mb-1">{t('eventModal.platformLabel')}</label>
            <select
              id="event-platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value as CalendarEvent['platform'])}
              className="w-full bg-neutral-700 border border-neutral-600 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
            >
              <option value="YouTube">YouTube</option>
              <option value="YouTube Shorts">YouTube Shorts</option>
              <option value="TikTok">TikTok</option>
              <option value="Instagram">Instagram</option>
            </select>
          </div>
        </div>
        <div className="flex justify-between items-center mt-6">
          <div>
            {event && (
              <Button onClick={handleDelete} variant="secondary" className="bg-red-800 hover:bg-red-700 text-white">
                {t('eventModal.delete')}
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={onClose} variant="secondary">{t('eventModal.cancel')}</Button>
            <Button onClick={handleSave} disabled={!title.trim()}>{t('eventModal.save')}</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EventModal;
