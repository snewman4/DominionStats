module.exports = {
    testMatch: ['<rootDir>/**/__tests__/*.spec.ts', '<rootDir>/**/__tests__/*.spec.js'],
    coverageThreshold: {
        global: {
            statements: 95,
            branches: 84,
            functions: 90,
            lines: 95
        }
    },
    moduleNameMapper: {
        '^lightning/(.+)$': '<rootDir>/src/client/modules/lightning/$1/$1',
        '^lightningtest/(.+)$': '<rootDir>/src/client/modules/lightningtest/$1/$1',
        '^my/(.+)$': '<rootDir>/src/client/modules/my/$1/$1'
    },
    preset: '@lwc/jest-preset',
    moduleFileExtensions: ['js', 'ts'],
    resolver: require.resolve('@lwc/jest-resolver')
};
