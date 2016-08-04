/* eslint global-require:0 */
const { NODE_ENV } = process.env;

if (NODE_ENV === 'local') module.exports = require('./configureStore.local');
else module.exports = require('./configureStore.production');
