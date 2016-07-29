const webpackConfig = require('./webpack.config');

module.exports = config => config.set({
  basePath: '',
  frameworks: ['mocha'],
  files: [
    'webpack.tests.js',
  ],
  preprocessors: {
    'webpack.tests.js': ['webpack', 'sourcemap'],
  },
  webpack: webpackConfig,
  webpackMiddleware: {
    noInfo: true,
    stats: 'errors-only',
  },
  plugins: [
    'karma-webpack',
    'karma-sourcemap-loader',
    'karma-phantomjs-launcher',
    'karma-chrome-launcher',
    'karma-mocha',
    'karma-coverage',
  ],
  reporters: ['progress', 'coverage'],
  coverageReporter: {
    dir: 'client/dist/reports/coverage',
    reporters: [
      { type: 'lcov', subdir: '.' },
      { type: 'json', subdir: '.' },
      { type: 'text-summary' },
    ],
  },
  port: 9876,
  colors: true,
  logLevel: config.LOG_INFO,
  autoWatch: true,
  browsers: ['PhantomJS', 'Chrome'],
  singleRun: true,
  concurrency: Infinity,
});
