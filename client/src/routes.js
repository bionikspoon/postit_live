import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';
import LiveApp from './containers/LiveApp';

export default (
  <Route path="/">
    <IndexRoute component={LiveApp} />
    <Redirect from="*" to="/" />
  </Route>
);
