import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import App from './components/App';
import LiveApp from './containers/LiveApp';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={LiveApp} />
    <Redirect from="*" to="/" />
  </Route>
);
