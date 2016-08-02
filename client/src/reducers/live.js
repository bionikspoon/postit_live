import * as types from '../constants/LiveActionTypes';
import { OPENED } from '../constants/LiveStatusTypes';
import update from 'react-addons-update';
import findIndex from 'lodash/findIndex';

const initialState = {
  isFetching: false,

  channel: {
    title: 'ninja watchers',
    resources: 'I like turtles',
    resources_html: '<p>I like turtles</p>',
    discussions: 'no discussions yet. [start one](#)',
    discussions_html: '<p>no discussions yet. <a href="#">start one</a></p>',
    contributors: '- [/u/admin](#)',
    contributors_html: '<ul><li><a href="#">/u/admin</a></li></ul>',
    status: OPENED,
  },
  activity: {
    viewers: 5,
  },
  messages: [],
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case types.CREATE:
      return handleCreate(state, action.payload);

    case types.STRIKE:
      return handleStrike(state, action.payload);

    case types.DELETE:
      return handleDelete(state, action.payload);

    case types.FETCH_MESSAGES_REQUEST:
      return handleFetchChannelRequest(state, action.payload);

    case types.FETCH_MESSAGES_SUCCESS:
      return handleFetchChannelSuccess(state, action.payload);

    case types.FETCH_MESSAGES_FAILURE:
      return handleFetchChannelFailure(state, action.payload);

    case types.ACTIVITY:
      return state;

    default:
      return state;
  }
}

function handleCreate(state, payload) {
  return update(state, { messages: { $push: [payload.message] } });
}

function handleStrike(state, payload) {
  const { id } = payload;
  const index = findIndex(state.messages, { id });
  if (index === -1) return state;

  return update(state, { messages: { [index]: { status: { $set: 'stricken' } } } });
}

function handleDelete(state, payload) {
  const { id } = payload;
  const index = findIndex(state.messages, { id });
  if (index === -1) return state;

  return update(state, { messages: { $splice: [[index, 1]] } });
}

function handleFetchChannelRequest(state) {
  return update(state, { isFetching: { $set: true } });
}

function handleFetchChannelSuccess(state, payload) {
  const messages = payload.messages.map(message => ({
    author: { username: 'admin' },
    body: message.body,
    body_html: message.body_html,
    created: message.created,
    status: message.status,
    id: message.id,
  }));
  return update(state, {
    isFetching: { $set: false },
    channel: {
      title: { $set: payload.title },
      resources: { $set: payload.resources },
      resources_html: { $set: payload.resources_html },
    },
    messages: {
      $push: messages,
    },
  });
}

function handleFetchChannelFailure(state, payload) {
  return update(state, {
    isFetching: { $set: false },
  });
}
