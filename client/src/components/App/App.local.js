import React, { PropTypes } from 'react';
import DevTools from '../../containers/DevTools';

export default function App({ children }) {
  return (
    <main>
      {children}
      <DevTools />
    </main>
  );
}

App.propTypes = { children: PropTypes.element.isRequired };
