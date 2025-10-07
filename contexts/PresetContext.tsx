import React, { createContext, useState, useContext, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { defaultPresets } from '../presets/data';
import { Preset } from '../types';

interface PresetContextType {
  activePreset: Preset;
  allPresets: Preset[];
  isBrandLockActive: boolean;
  setActivePresetId: (id: string) => void;
  addPreset: (newPreset: Preset) => boolean;
}

const PresetContext = createContext<PresetContextType | undefined>(undefined);

export const PresetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [allPresets, setAllPresets] = useState<Preset[]>(() => {
    try {
      const storedPresets = localStorage.getItem('creator-suite-presets');
      const parsed = storedPresets ? JSON.parse(storedPresets) : defaultPresets;
      if (Array.isArray(parsed) && parsed.length > 0 && parsed.every(p => 'id' in p && 'name' in p && 'context' in p)) {
        return parsed;
      }
      return defaultPresets;
    } catch {
      return defaultPresets;
    }
  });

  const [activePresetId, setActivePresetId] = useState<string>(() => {
    try {
      const storedId = localStorage.getItem('creator-suite-preset-id');
      const presetsList = allPresets || defaultPresets;
      if (storedId && presetsList.some(p => p.id === storedId)) {
        return storedId;
      }
      return 'none';
    } catch {
      return 'none';
    }
  });
  
  useEffect(() => {
    try {
      localStorage.setItem('creator-suite-presets', JSON.stringify(allPresets));
      if (!allPresets.some(p => p.id === activePresetId)) {
          setActivePresetId('none');
      }
    } catch (error) {
      console.error("Could not save presets to localStorage", error);
    }
  }, [allPresets, activePresetId]);

  useEffect(() => {
    try {
      localStorage.setItem('creator-suite-preset-id', activePresetId);
    } catch (error) {
      console.error("Could not save preset ID to localStorage", error);
    }
  }, [activePresetId]);
  
  const activePreset = useMemo(() => {
    return allPresets.find(p => p.id === activePresetId) || allPresets.find(p => p.id === 'none') || defaultPresets[0];
  }, [activePresetId, allPresets]);

  const isBrandLockActive = useMemo(() => activePreset.id === 'avada-commerce', [activePreset]);
  
  const addPreset = useCallback((newPreset: Preset): boolean => {
    if (!newPreset || typeof newPreset.id !== 'string' || typeof newPreset.name !== 'string' || typeof newPreset.context !== 'string' || !newPreset.id.trim() || !newPreset.name.trim()) {
        console.error("Invalid preset format", newPreset);
        return false;
    }
    
    setAllPresets(prev => {
      const existingIndex = prev.findIndex(p => p.id === newPreset.id);
      if (existingIndex > -1) {
        const updatedPresets = [...prev];
        updatedPresets[existingIndex] = newPreset;
        return updatedPresets;
      }
      return [...prev, newPreset];
    });
    return true;
  }, []);

  return (
    <PresetContext.Provider value={{ activePreset, allPresets, isBrandLockActive, setActivePresetId, addPreset }}>
      {children}
    </PresetContext.Provider>
  );
};

export const usePreset = (): PresetContextType => {
  const context = useContext(PresetContext);
  if (!context) {
    throw new Error('usePreset must be used within a PresetProvider');
  }
  return context;
};
