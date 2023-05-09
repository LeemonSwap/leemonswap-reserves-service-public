// Mongo db connection string
export const MONGODB_URL = process.env.MONGODB_URI;

// Atlas envs for ip whitelist
export const ATLAS = {
    PUBLIC_KEY: process.env.ALTAS_PUB,
    PRIVATE_KEY: process.env.ALTAS_PRIV,
    ID: process.env.ALTAS_ID,
};

export const ENV: 'production' | 'staging' | 'development' | 'test' = (process.env.NODE_ENV as any) || 'development';

// utilities for environment
export const isDevelopment = ['development', 'staging', 'dev'].includes(ENV);
export const isProduction = ['porudction', 'prod'].includes(ENV);
export const isTest = ENV === 'test';
