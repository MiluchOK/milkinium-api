module.exports = {
    testPathIgnorePatterns: ["/integration"],
    testMatch: [ "**/?(*.)+(spec|test).js?(x)" ],
    verbose: true,
    testURL: 'http://localhost/'
}