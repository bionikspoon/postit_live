import React, { PropTypes } from 'react';

export default function App({ children }) {
  return (
    <main>
      {children}
    </main>
  );
}

App.propTypes = { children: PropTypes.element.isRequired };
