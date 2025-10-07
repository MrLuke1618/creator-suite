import React, { useMemo } from 'react';
import { Tool } from '../types';
import Card from './ui/Card';
import { useLocalization } from '../contexts/LocalizationContext';

interface HelpModalProps {
  tool: Tool;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ tool, onClose }) => {
  const { t } = useLocalization();

  const helpInfo = useMemo(() => ({
    [Tool.DASHBOARD]: { titleKey: 'help.dashboardTitle', contentKey: 'help.dashboardContent' },
    [Tool.IDEA_LAB]: { titleKey: 'help.ideaLabTitle', contentKey: 'help.ideaLabContent' },
    [Tool.PRODUCTION_STUDIO]: { titleKey: 'help.productionStudioTitle', contentKey: 'help.productionStudioContent' },
    [Tool.VIDEO_LAB]: { titleKey: 'help.videoLabTitle', contentKey: 'help.videoLabContent' },
    [Tool.ANALYTICS_HUB]: { titleKey: 'help.analyticsHubTitle', contentKey: 'help.analyticsHubContent' },
    [Tool.CONTENT_CALENDAR]: { titleKey: 'help.calendarTitle', contentKey: 'help.calendarContent' },
  }), []);

  const { titleKey, contentKey } = helpInfo[tool] || { titleKey: "Help", contentKey: null };
  const title = t(titleKey);
  const contentSections: Array<{ heading: string, points: string[] }> = contentKey ? t(contentKey) : [];
  
  return (
    <div 
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <Card className="max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label={t('help.close')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="text-gray-300 max-h-[60vh] overflow-y-auto pr-4">
            {Array.isArray(contentSections) && contentSections.map((section, index) => (
              <div key={index} className="mb-6">
                <h4 className="font-bold text-lg text-brand-light mb-2">{section.heading}</h4>
                <div className="space-y-3 pl-4 border-l-2 border-neutral-700">
                  {section.points.map((point: string, pIndex: number) => (
                    <p key={pIndex} dangerouslySetInnerHTML={{ __html: point }}></p>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
};

export default HelpModal;
