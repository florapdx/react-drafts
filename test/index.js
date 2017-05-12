// Set require context for browser execution
// Skip execution in Node environment
// (see https://survivejs.com/webpack/techniques/testing/)
if (module.hot) {
  const context = require.context(
    'mocha-loader!./', // Process through mocha-loader
    false, // Skip recursive processing
    /\.test.js$/ // Pick only files ending with .test.js
  );

  // Execute each test suite
  context.keys().forEach(context);
}
