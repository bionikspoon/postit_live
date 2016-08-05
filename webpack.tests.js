import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import a11y from 'react-a11y';

const { beforeEach, afterEach } = global;
beforeEach(() => a11y(React, { ReactDOM, throw: true }));
afterEach(() => a11y.restoreAll());

const context = require.context('./client/src', true, /^.+\/__tests__\/.+\.spec\.jsx?$/);

context.keys().forEach(context);
module.exports = context;
