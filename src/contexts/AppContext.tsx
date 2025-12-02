import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TreePlant {
  id: number;
  area: {
    id: number;
    name: string;
    lat: number;
    lng: number;
    pollution: string;
    population: string;
    description: string;
  };
  treeType: {
    name: string;
    emoji: string;
    co2Absorption: number;
  };
  date: string;
  co2Absorption: number;
}

interface AppState {
  treesPlanted: number;
  redZones: number;
  co2Saved: number;
  plantedTrees: TreePlant[];
}

interface AppContextType {
  state: AppState;
  plantTree: (tree: TreePlant) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    treesPlanted: 0,
    redZones: 8,
    co2Saved: 0,
    plantedTrees: [],
  });

  useEffect(() => {
    const savedTrees = localStorage.getItem('plantedTrees');
    if (savedTrees) {
      const trees: TreePlant[] = JSON.parse(savedTrees);
      const totalCo2 = trees.reduce((sum, tree) => sum + tree.co2Absorption, 0);
      setState(prev => ({
        ...prev,
        treesPlanted: trees.length,
        co2Saved: totalCo2,
        plantedTrees: trees,
      }));
    }
  }, []);

  const plantTree = (tree: TreePlant) => {
    setState(prev => ({
      ...prev,
      treesPlanted: prev.treesPlanted + 1,
      co2Saved: prev.co2Saved + tree.co2Absorption,
      plantedTrees: [...prev.plantedTrees, tree],
    }));
  };

  return (
    <AppContext.Provider value={{ state, plantTree }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
