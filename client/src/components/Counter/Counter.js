import './Counter.scss';
import React, { PropTypes } from 'react';

export default function Counter({ value, incrementCounter, decrementCounter }) {
  return (
    <div className="counter">
      <h1>Counter: {value}</h1>
      <button onClick={incrementCounter}>+</button>
      <button onClick={decrementCounter}>-</button>
      <hr />
    </div>
  );
}

Counter.propTypes = {
  value: PropTypes.number.isRequired,
  incrementCounter: PropTypes.func.isRequired,
  decrementCounter: PropTypes.func.isRequired,
};
