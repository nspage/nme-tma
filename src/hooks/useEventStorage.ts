import { useCallback } from 'react';
import { useStorage } from '@/contexts/StorageContext';
import { useTonConnect } from '@tonconnect/ui-react';
import { WalletContractV4 } from '@ton/ton';
import { EventMetadata } from '@/services/ton-storage';

export function useEventStorage() {
  const { tonStorage } = useStorage();
  const { wallet } = useTonConnect();

  const uploadEventMetadata = useCallback(
    async (eventId: string, metadata: EventMetadata) => {
      if (!tonStorage || !wallet) {
        throw new Error('Storage or wallet not initialized');
      }
      return tonStorage.uploadEventMetadata(
        wallet as WalletContractV4,
        eventId,
        metadata
      );
    },
    [tonStorage, wallet]
  );

  const updateEventMetadata = useCallback(
    async (eventId: string, metadata: EventMetadata) => {
      if (!tonStorage || !wallet) {
        throw new Error('Storage or wallet not initialized');
      }
      return tonStorage.updateEventMetadata(
        wallet as WalletContractV4,
        eventId,
        metadata
      );
    },
    [tonStorage, wallet]
  );

  const deleteEventMetadata = useCallback(
    async (eventId: string) => {
      if (!tonStorage || !wallet) {
        throw new Error('Storage or wallet not initialized');
      }
      return tonStorage.deleteEventMetadata(
        wallet as WalletContractV4,
        eventId
      );
    },
    [tonStorage, wallet]
  );

  return {
    uploadEventMetadata,
    updateEventMetadata,
    deleteEventMetadata,
    isReady: !!tonStorage && !!wallet,
  };
}
