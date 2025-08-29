import { nestConfig } from '@repo/jest-config';

export default {
    ...nestConfig,
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
    },
};
