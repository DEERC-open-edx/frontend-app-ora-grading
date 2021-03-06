const { createConfig } = require('@edx/frontend-build');

module.exports = createConfig('jest', {
  setupFilesAfterEnv: [
    'jest-expect-message',
    '<rootDir>/src/setupTest.js',
  ],
  modulePaths: ['<rootDir>/src/'],
  snapshotSerializers: [
    'enzyme-to-json/serializer',
  ],
  coveragePathIgnorePatterns: [
    'src/segment.js',
    'src/postcss.config.js',
  ],
  testTimeout: 120000,
});
