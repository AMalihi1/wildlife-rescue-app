import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  roots: ['<rootDir>'],
  setupFiles: [],
};

export default config;


