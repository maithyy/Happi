import React, { createContext, useContext, useState, ReactNode } from 'react';

type AppContextType = {
  triggerRefresh: boolean;
  setTriggerRefresh: (value: boolean | ((prev: boolean) => boolean)) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [triggerRefresh, setTriggerRefresh] = useState<boolean>(false);

  return (
    <AppContext.Provider value={{ triggerRefresh, setTriggerRefresh }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within a AppProvider');
  }
  return context;
};
