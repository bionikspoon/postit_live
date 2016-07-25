/**
 * Testing configuration
 *
 * Setup:
 *  - test runner: karma
 *  - assertions: expect (https://github.com/mjackson/expect)
 */
const webpackConfig = require('./webpack.config');
const testGlob = 'client/src/**/__tests__/**/*.js';
const srcGlob = 'client/src/@(actions|components|containers|reducers)/**/*.js';

module.exports = config => config.set({
  basePath: '',
  frameworks: ['mocha'],
  files: [
    testGlob,
    srcGlob,
  ],
  preprocessors: {
    // add webpack as a preprocessor
    [testGlob]: ['webpack', 'sourcemap'],
    [srcGlob]: ['webpack', 'sourcemap'],
  },
  webpack: webpackConfig,
  webpackMiddleware: {
    noInfo: true,
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
  browsers: ['PhantomJS','Chrome'],
  singleRun: true,
  concurrency: Infinity,
});
