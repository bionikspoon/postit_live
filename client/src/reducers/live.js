import * as types from '../constants/LiveActionTypes';
import update from 'react-addons-update';
const initialState = {
  messages: [
    {
      author: 'bionikspoon',
      body: 'I like turtles',
      body_html: '<p>I like turtles</p>',
      created: 1469766549,
      id: '0',
      name: 'LiveUpdate-0',
      stricken: false,
    },
  ],
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case types.CREATE:
      return update(state, { messages: { $push: [action.payload] } });

    case types.STRIKE:
      return state;

    case types.DELETE:
      return state;

    case types.ACTIVITY:
      return state;

    default:
      return state;
  }
}
