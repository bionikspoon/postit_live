require('babel-register');
const makeConfig = require('./config/make.webpack.config');
/**
 * The main webpack configuration.
 *
 * By default webpack commands will look for this file unless the --config [path] argument is used.
 * This config routes to other configs using, process.env.NODE_ENV to determine which config is being requested.
 *
 * Adding more configs:
 *  Just add the NODE_ENV=<config> prefix to your command or export to the environment.
 *  Add a case for your <config> value that returns the path to your config file.
 *
 * @returns {object} - returns a webpack config object
 */
const OPTIONS = {
  PROJECT_ROOT: __dirname,
  ENV: process.env.NODE_ENV || 'local',
};

module.exports = makeConfig(OPTIONS);
