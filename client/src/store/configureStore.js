/* eslint global-require:0 */
const { NODE_ENV } = process.env;

if (NODE_ENV === 'production') {
  module.exports = require('./configureStore.production');
}
else {
  module.exports = require('./configureStore.local');
}
