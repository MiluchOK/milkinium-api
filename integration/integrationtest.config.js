module.exports = {
    globalSetup: './setup/setup.js',
    globalTeardown: './setup/teardown.js',
    testEnvironment: './setup/mongo-environment.js',
    testMatch: [ "**/?(*.)+(spec|test).js?(x)" ],
    clearMocks: true,
    setupTestFrameworkScriptFile: "./setup/frameworkSetup.js"
    // resetMocks: true,
    // resetModules: true,
    
  };