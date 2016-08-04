/* eslint global-require:0 */
const { NODE_ENV } = process.env;

if (NODE_ENV === 'local') module.exports = require('./App.local');
else module.exports = require('./App.production');
