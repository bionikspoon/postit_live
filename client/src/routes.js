import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';
import LiveAppChannel from './containers/LiveAppChannel';
import LiveAppSettings from './containers/LiveAppSettings';
import LiveAppContributors from './containers/LiveAppContributors';
import LiveApp from './containers/LiveApp';

export default (
  <Route path="/live/">
    <Route path=":slug/" component={LiveApp}>
      <IndexRoute component={LiveAppChannel} />
      <Route path="settings/" component={LiveAppSettings} />
      <Route path="contributors/" component={LiveAppContributors} />
    </Route>
  </Route>
);
