import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';
import LiveApp from './containers/LiveApp';

export default (
  <Route path="/live/">
    <Route path=":slug/">
      <IndexRoute component={LiveApp} />
    </Route>
  </Route>
);
