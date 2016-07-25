require('babel-register');
const makeConfig = require('./config/make.webpack.config');

const OPTIONS = {
  PROJECT_ROOT: __dirname,
  ENV: process.env.NODE_ENV || 'local',
};

module.exports = makeConfig(OPTIONS);
