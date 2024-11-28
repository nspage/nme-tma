import { TonConnectError } from '@tonconnect/sdk';
import { toast } from 'sonner';

export class BadgeError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'BadgeError';
  }
}

export const ErrorCodes = {
  WALLET_NOT_CONNECTED: 'WALLET_NOT_CONNECTED',
  INVALID_ADDRESS: 'INVALID_ADDRESS',
  METADATA_UPLOAD_FAILED: 'METADATA_UPLOAD_FAILED',
  MINTING_FAILED: 'MINTING_FAILED',
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  NETWORK_ERROR: 'NETWORK_ERROR',
  CONTRACT_ERROR: 'CONTRACT_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

export interface ErrorDetails {
  code: ErrorCode;
  message: string;
  details?: any;
}

export const handleError = (error: unknown): ErrorDetails => {
  console.error('Error occurred:', error);

  if (error instanceof BadgeError) {
    return {
      code: error.code as ErrorCode,
      message: error.message,
      details: error.details,
    };
  }

  if (error instanceof TonConnectError) {
    return {
      code: ErrorCodes.WALLET_NOT_CONNECTED,
      message: 'Wallet connection error. Please try again.',
      details: error,
    };
  }

  if (error instanceof Error) {
    // Try to parse contract errors
    if (error.message.includes('insufficient balance')) {
      return {
        code: ErrorCodes.INSUFFICIENT_BALANCE,
        message: 'Insufficient balance to perform this operation',
        details: error,
      };
    }

    if (error.message.includes('unauthorized')) {
      return {
        code: ErrorCodes.UNAUTHORIZED,
        message: 'You are not authorized to perform this operation',
        details: error,
      };
    }

    // Network related errors
    if (error.message.includes('network') || error.message.includes('timeout')) {
      return {
        code: ErrorCodes.NETWORK_ERROR,
        message: 'Network error. Please check your connection and try again.',
        details: error,
      };
    }

    // Contract related errors
    if (error.message.includes('contract')) {
      return {
        code: ErrorCodes.CONTRACT_ERROR,
        message: 'Smart contract error. Please try again later.',
        details: error,
      };
    }
  }

  // Default error
  return {
    code: ErrorCodes.CONTRACT_ERROR,
    message: 'An unexpected error occurred. Please try again.',
    details: error,
  };
};

export const showError = (error: unknown) => {
  const { message } = handleError(error);
  toast.error(message);
};

export const validateAddress = (address: string): boolean => {
  try {
    return address.startsWith('EQ') && address.length === 48;
  } catch {
    return false;
  }
};

export const validateMetadata = (metadata: any): boolean => {
  const requiredFields = ['name', 'description', 'attributes'];
  return requiredFields.every(field => metadata[field] !== undefined);
};

export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: unknown;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Don't retry if it's a user error
      if (error instanceof BadgeError) {
        throw error;
      }

      // Wait before retrying
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }

  throw lastError;
};
