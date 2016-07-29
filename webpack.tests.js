import 'babel-polyfill';
const context = require.context('./client/src', true, /^.+\/__tests__\/.+\.spec\.jsx?$/);

context.keys().forEach(context);
module.exports = context;
