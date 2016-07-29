require('babel-register');
const unipath = require('unipath');
const makeConfig = require('./config/make.webpack.config');

const OPTIONS = {
  PATH: {
    root: unipath(),
    src: unipath('client', 'src'),
    dist: unipath('client', 'dist'),
  },
  PROJECT_ROOT: __dirname,
  ENV: process.env.NODE_ENV || 'local',
};

module.exports = makeConfig(OPTIONS);
