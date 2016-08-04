import * as types from '../constants/LiveActionTypes';
import { OPENED } from '../constants/LiveChannelStatus';
import update from 'react-addons-update';
import _ from 'lodash';

const initialState = {
  meta: {
    synced: false,
    isFetching: false,
    subscribers: 0,
  },

  channel: {
    title: '',
    resources: '',
    resources_html: '',
    description: '',
    description_html: '',
    discussions: 'no discussions yet. [start one](#)',
    discussions_html: '<p>no discussions yet. <a href="#">start one</a></p>',
    contributors: '- [/u/admin](#)',
    contributors_html: '<ul><li><a href="#">/u/admin</a></li></ul>',
    status: OPENED,
  },

  messages: {},

  currentUser:{},
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case types.CREATE_MESSAGE:
      return handleCreateMessage(state, action.payload);

    case types.STRIKE_MESSAGE:
      return handleStrikeMessage(state, action.payload);

    case types.DELETE_MESSAGE:
      return handleDeleteMessage(state, action.payload);

    case types.UPDATE_CHANNEL:
      return handleUpdateChannel(state, action.payload);

    case types.FETCH_CHANNEL_REQUEST:
      return handleFetchChannelRequest(state, action.payload);

    case types.FETCH_CHANNEL_SUCCESS:
      return handleFetchChannelSuccess(state, action.payload);

    case types.FETCH_CHANNEL_FAILURE:
      return handleFetchChannelFailure(state, action.payload);

    case types.ACTIVITY:
      return state;

    default:
      return state;
  }
}

function handleCreateMessage(state, payload) {
  const { message } = payload;
  return update(state, { messages: { [message.id]: { $set: message } } });
}

function handleStrikeMessage(state, payload) {
  const { id } = payload;

  return update(state, { messages: { [id]: { status: { $set: 'stricken' } } } });
}

function handleDeleteMessage(state, payload) {
  const { id } = payload;
  return update(state, { messages: { $set: _.omit(state.messages, [id]) } });
}

function handleUpdateChannel(state, payload) {
  return update(state, { channel: { $merge: payload } });
}

function handleFetchChannelRequest(state) {
  return update(state, { meta: { isFetching: { $set: true } } });
}

function handleFetchChannelSuccess(state, payload) {
  const messages = payload.messages.reduce((obj, message) =>
    update(obj, {
      [message.id]: {
        $set: {
          author: { username: 'admin' },
          body: message.body,
          body_html: message.body_html,
          created: message.created,
          status: message.status,
          id: message.id,
        },
      },
    }), {});

  return update(state, {
    meta: {
      isFetching: { $set: false },
      synced: { $set: true },
    },
    channel: {
      title: { $set: payload.title },
      resources: { $set: payload.resources },
      resources_html: { $set: payload.resources_html },
    },
    messages: {
      $merge: messages,
    },
  });
}

function handleFetchChannelFailure(state, payload) {
  return update(state, { meta: { isFetching: { $set: false } } });
}
