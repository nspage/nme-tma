import { z } from 'zod';

const envSchema = z.object({
  // Network
  TON_ENDPOINT: z.string().url(),
  TON_NETWORK: z.enum(['mainnet', 'testnet']),

  // Contracts
  BADGE_COLLECTION_ADDRESS: z.string().regex(/^EQ[a-zA-Z0-9]{48}$/),
  TON_STORAGE_CONTRACT: z.string().regex(/^EQ[a-zA-Z0-9]{48}$/),

  // API Keys
  TON_CENTER_API_KEY: z.string().min(1),

  // Feature Flags
  ENABLE_TESTNET: z.coerce.boolean().default(false),
  ENABLE_BATCH_MINTING: z.coerce.boolean().default(true),
  ENABLE_CHECK_IN: z.coerce.boolean().default(true),

  // Security
  MAX_BATCH_SIZE: z.coerce.number().positive().default(100),
  RATE_LIMIT_REQUESTS: z.coerce.number().positive().default(100),
  RATE_LIMIT_WINDOW: z.coerce.number().positive().default(60000),
});

const parseEnv = () => {
  try {
    return envSchema.parse({
      TON_ENDPOINT: import.meta.env.VITE_TON_ENDPOINT,
      TON_NETWORK: import.meta.env.VITE_TON_NETWORK,
      BADGE_COLLECTION_ADDRESS: import.meta.env.VITE_BADGE_COLLECTION_ADDRESS,
      TON_STORAGE_CONTRACT: import.meta.env.VITE_TON_STORAGE_CONTRACT,
      TON_CENTER_API_KEY: import.meta.env.VITE_TON_CENTER_API_KEY,
      ENABLE_TESTNET: import.meta.env.VITE_ENABLE_TESTNET,
      ENABLE_BATCH_MINTING: import.meta.env.VITE_ENABLE_BATCH_MINTING,
      ENABLE_CHECK_IN: import.meta.env.VITE_ENABLE_CHECK_IN,
      MAX_BATCH_SIZE: import.meta.env.VITE_MAX_BATCH_SIZE,
      RATE_LIMIT_REQUESTS: import.meta.env.VITE_RATE_LIMIT_REQUESTS,
      RATE_LIMIT_WINDOW: import.meta.env.VITE_RATE_LIMIT_WINDOW,
    });
  } catch (error) {
    console.error('Environment validation failed:', error);
    throw new Error('Invalid environment configuration');
  }
};

export const env = parseEnv();

// Type-safe environment configuration
export type Env = z.infer<typeof envSchema>;

// Environment-specific configurations
export const isProduction = import.meta.env.PROD;
export const isDevelopment = import.meta.env.DEV;
export const isTestnet = env.TON_NETWORK === 'testnet';

// Feature flags
export const features = {
  batchMinting: env.ENABLE_BATCH_MINTING,
  checkIn: env.ENABLE_CHECK_IN,
  testnet: env.ENABLE_TESTNET,
} as const;

// Security configurations
export const security = {
  maxBatchSize: env.MAX_BATCH_SIZE,
  rateLimit: {
    requests: env.RATE_LIMIT_REQUESTS,
    window: env.RATE_LIMIT_WINDOW,
  },
} as const;
