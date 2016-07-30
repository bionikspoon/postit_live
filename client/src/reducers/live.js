import * as types from '../constants/LiveActionTypes';
import { OPENED } from '../constants/LiveStatusTypes';
import update from 'react-addons-update';
import findIndex from 'lodash/findIndex';

const initialState = {
  room: {
    title: 'ninja watchers',
    resources: 'I like turtles',
    resources_html: { __html: '<p>I like turtles</p>' },
    discussions: 'no discussions yet. [start one](#)',
    discussions_html: { __html: '<p>no discussions yet. <a href="#">start one</a></p>' },
    contributors: '- [/u/admin](#)',
    contributors_html: { __html: '<ul><li><a href="#">/u/admin</a></li></ul>' },
    status: OPENED,
  },
  activity: {
    viewers: 5,
  },
  messages: [
    {
      author: 'admin',
      body: 'I like turtles',
      body_html: { __html: 'I like turtles' },
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
