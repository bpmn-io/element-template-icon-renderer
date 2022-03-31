var allTests = require.context('.', true, /(spec|integration).*spec\.js$/);

allTests.keys().forEach(allTests);