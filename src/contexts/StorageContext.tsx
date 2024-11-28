import React, { createContext, useContext, useEffect, useState } from 'react';
import { TonStorageService, createTonStorageService } from '../services/ton-storage';
import { useTonConnectUI } from '@tonconnect/ui-react';

interface StorageContextType {
  tonStorage: TonStorageService | null;
  isInitialized: boolean;
  error: Error | null;
}

const StorageContext = createContext<StorageContextType>({
  tonStorage: null,
  isInitialized: false,
  error: null,
});

export const StorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tonStorage, setTonStorage] = useState<TonStorageService | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [tonConnectUI] = useTonConnectUI();

  useEffect(() => {
    const initializeStorage = async () => {
      try {
        // Initialize TON Storage with the appropriate network endpoint
        const endpoint = import.meta.env.VITE_TON_ENDPOINT || 'https://toncenter.com/api/v2/jsonRPC';
        const storage = createTonStorageService(endpoint);
        setTonStorage(storage);
        setIsInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize storage'));
      }
    };

    initializeStorage();
  }, [tonConnectUI]);

  return (
    <StorageContext.Provider value={{ tonStorage, isInitialized, error }}>
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = () => {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  return context;
};
