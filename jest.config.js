const path = require('path');
let tsJestPath = 'ts-jest';
try {
  tsJestPath = require.resolve('ts-jest');
} catch {
  tsJestPath = path.resolve(__dirname, '../ownpay/node_modules/ts-jest');
}

module.exports = {
  transform: {
    '^.+\\.tsx?$': [tsJestPath, { tsconfig: 'tsconfig.json' }],
  },
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  verbose: true,
};

