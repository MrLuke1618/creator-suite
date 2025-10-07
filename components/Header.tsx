
import React, { useState, useMemo } from 'react';
import { Tool, Language } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';

interface HeaderProps {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
  onHelpClick: () => void;
}

const NavButton: React.FC<{
  label: string;
  tool: Tool;
  activeTool: Tool;
  onClick: (tool: Tool) => void;
  icon: React.ReactNode;
}> = ({ label, tool, activeTool, onClick, icon }) => {
  const isActive = activeTool === tool;
  return (
    <button
      onClick={() => onClick(tool)}
      className={`flex items-center gap-1.5 px-2 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
        isActive ? 'bg-brand-purple text-white' : 'text-gray-300 hover:bg-neutral-700 hover:text-white'
      }`}
    >
      {icon}
      {label}
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ activeTool, setActiveTool, onHelpClick }) => {
  const { t, language, setLanguage } = useLocalization();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = useMemo(() => [
    { label: t('header.dashboard'), tool: Tool.DASHBOARD, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
    { label: t('header.ideaLab'), tool: Tool.IDEA_LAB, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg> },
    { label: t('header.calendar'), tool: Tool.CONTENT_CALENDAR, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
    { label: t('header.productionStudio'), tool: Tool.PRODUCTION_STUDIO, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 16v-2m8-8h2m-18 0h2m14.485-4.485l1.414-1.414M5.101 18.899l1.414-1.414M18.899 5.101l-1.414 1.414M6.515 6.515l-1.414-1.414" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { label: t('header.videoLab'), tool: Tool.VIDEO_LAB, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> },
    { label: t('header.analyticsHub'), tool: Tool.ANALYTICS_HUB, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
  ], [t]);

  const handleNavClick = (tool: Tool) => {
    setActiveTool(tool);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="bg-neutral-800 border-b border-neutral-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white mr-2 sm:mr-4 flex-shrink-0">{t('header.title')}</h1>
              <nav className="hidden md:flex items-center space-x-1">
                {navItems.map(item => (
                    <NavButton key={item.tool} label={item.label} tool={item.tool} activeTool={activeTool} onClick={handleNavClick} icon={item.icon} />
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                  <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as Language)}
                      className="bg-neutral-700 border border-neutral-600 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple appearance-none"
                      aria-label={t('header.language')}
                  >
                      <option value={Language.EN}>{t('header.english')}</option>
                      <option value={Language.VI}>{t('header.vietnamese')}</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
              </div>
              <button
                onClick={onHelpClick}
                className="flex items-center justify-center h-10 w-10 rounded-full text-gray-300 hover:bg-neutral-700 hover:text-white transition-colors"
                aria-label={t('header.help')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="flex items-center justify-center h-10 w-10 rounded-full text-gray-300 hover:bg-neutral-700 hover:text-white transition-colors"
                  aria-label="Open menu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900 p-4 flex flex-col md:hidden animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-xl font-bold text-white">{t('header.title')}</h1>
                <button 
                    onClick={() => setIsMenuOpen(false)} 
                    className="flex items-center justify-center h-10 w-10 rounded-full text-gray-300 hover:bg-neutral-800 transition-colors" 
                    aria-label="Close menu"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            <nav className="flex flex-col gap-4">
                {navItems.map(item => (
                    <button 
                        key={item.tool} 
                        onClick={() => handleNavClick(item.tool)} 
                        className={`flex items-center gap-3 p-3 rounded-md text-lg font-medium transition-colors ${
                            activeTool === item.tool ? 'bg-brand-purple text-white' : 'text-gray-300 hover:bg-neutral-800'
                        }`}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
        </div>
      )}
    </>
  );
};

export default Header;
