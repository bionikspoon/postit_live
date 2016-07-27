/* eslint global-require:0 */
const { NODE_ENV } = process.env;

if (NODE_ENV === 'production') {
  module.exports = require('./App.production');
}
else {
  module.exports = require('./App.local');
}
