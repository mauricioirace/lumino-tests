module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: [
        '<rootDir>/test/'
    ],
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: ['/node_modules/']
};
