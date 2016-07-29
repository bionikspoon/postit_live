import * as types from '../constants/LiveActionTypes';
import update from 'react-addons-update';
import findIndex from 'lodash/findIndex';

const initialState = {
  messages: [
    {
      author: 'admin',
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
  const index = findIndex(state.messages, action.payload);

  switch (action.type) {
    case types.CREATE:
      return update(state, { messages: { $push: [action.payload] } });

    case types.STRIKE:
      return index === -1
        ? state
        : update(state, { messages: { [index]: { stricken: { $set: true } } } });

    case types.DELETE:
      return index === -1
        ? state
        : update(state, { messages: { $splice: [[index, 1]] } });

    case types.ACTIVITY:
      return state;

    default:
      return state;
  }
}
