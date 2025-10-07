import React, { useState, useEffect } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { Task, TaskPriority } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  task: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, task }) => {
  const { t } = useLocalization();
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);

  useEffect(() => {
    if (task) {
      setText(task.text);
      setPriority(task.priority);
    }
  }, [task, isOpen]);

  if (!isOpen || !task) return null;

  const handleSave = () => {
    if (!text.trim()) return;
    onSave({
      ...task,
      text: text.trim(),
      priority,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <Card className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">{t('taskModal.editTitle')}</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="task-text" className="block text-sm font-medium text-gray-300 mb-1">{t('taskModal.textLabel')}</label>
            <input
              id="task-text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-neutral-700 border border-neutral-600 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
            />
          </div>
          <div>
            <label htmlFor="task-priority" className="block text-sm font-medium text-gray-300 mb-1">{t('taskModal.priorityLabel')}</label>
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full bg-neutral-700 border border-neutral-600 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
            >
              <option value={TaskPriority.LOW}>{t('dashboard.lowPriority')}</option>
              <option value={TaskPriority.MEDIUM}>{t('dashboard.mediumPriority')}</option>
              <option value={TaskPriority.HIGH}>{t('dashboard.highPriority')}</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={onClose} variant="secondary">{t('eventModal.cancel')}</Button>
          <Button onClick={handleSave} disabled={!text.trim()}>{t('eventModal.save')}</Button>
        </div>
      </Card>
    </div>
  );
};

export default TaskModal;