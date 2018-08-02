module.exports = {
    globalSetup: './setup/setup.js',
    globalTeardown: './setup/teardown.js',
    testEnvironment: './setup/mongo-environment.js',
    testMatch: [ "**/?(*.)+(spec|test).js?(x)" ],
    clearMocks: true
    // resetMocks: true,
    // resetModules: true,
    
  };