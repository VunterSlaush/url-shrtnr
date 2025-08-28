import type { Config } from 'jest';
import { config as baseConfig } from './base';

export const nestConfig = {
  ...baseConfig,
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  coveragePathIgnorePatterns: [
    './test/',
    './api/coverage',
  ],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
} as const satisfies Config;
