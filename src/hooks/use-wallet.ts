import { useTonConnectUI } from '@tonconnect/ui-react';
import { useCallback, useEffect, useState } from 'react';
import { Address } from 'ton-core';
import { toast } from 'sonner';

export interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  address?: Address;
  network?: string;
  error?: Error;
}

export function useWallet() {
  const [tonConnectUI] = useTonConnectUI();
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    isConnecting: false,
  });

  const handleWalletUpdate = useCallback(() => {
    if (tonConnectUI.connected && tonConnectUI.account) {
      setState({
        isConnected: true,
        isConnecting: false,
        address: Address.parse(tonConnectUI.account.address),
        network: tonConnectUI.account.chain,
      });
    } else {
      setState({
        isConnected: false,
        isConnecting: false,
      });
    }
  }, [tonConnectUI]);

  useEffect(() => {
    handleWalletUpdate();
    // Subscribe to wallet changes
    tonConnectUI.onStatusChange(handleWalletUpdate);
  }, [handleWalletUpdate, tonConnectUI]);

  const connect = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isConnecting: true, error: undefined }));
      await tonConnectUI.connectWallet();
      toast.success('Wallet connected successfully');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setState(prev => ({ ...prev, error: error as Error }));
      toast.error('Failed to connect wallet. Please try again.');
    } finally {
      setState(prev => ({ ...prev, isConnecting: false }));
    }
  }, [tonConnectUI]);

  const disconnect = useCallback(async () => {
    try {
      await tonConnectUI.disconnect();
      setState({
        isConnected: false,
        isConnecting: false,
      });
      toast.success('Wallet disconnected');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      toast.error('Failed to disconnect wallet');
    }
  }, [tonConnectUI]);

  return {
    ...state,
    connect,
    disconnect,
    tonConnectUI,
  };
}
