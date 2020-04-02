module.exports = {
    globalSetup: './setup/setup.js',
    globalTeardown: './setup/teardown.js',
    testEnvironment: './setup/mongo-environment.js',
    testMatch: [ "**/?(*.)+(spec|test).js?(x)" ],
    clearMocks: true,
    setupFilesAfterEnv: ["./setup/frameworkSetup.js"]
    // resetMocks: true,
    // resetModules: true,
    
  };