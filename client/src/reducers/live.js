import * as types from '../constants/LiveActionTypes';
import { CHANNEL_OPENED } from '../constants/ChannelStatus';
import { CONNECTION_CLOSED } from '../constants/ConnectionStatus';
import update from 'react-addons-update';
import _ from 'lodash';
const debug = require('debug')('app:reducers:live');  // eslint-disable-line no-unused-vars
const initialState = {
  meta: {
    synced: false,
    isFetching: false,
    subscribers: 0,
    connectionStatus: CONNECTION_CLOSED,
  },

  channel: {
    title: '',
    resources: '',
    resources_html: '',
    description: '',
    description_html: '',
    discussions: 'no discussions yet. [start one](#)',
    discussions_html: '<p>no discussions yet. <a href="#">start one</a></p>',
    contributors_html: '',
    status: CHANNEL_OPENED,
  },

  messages: {},

  currentUser: {
    isFetching: false,
    username: null,
  },
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

    case types.UPDATE_CONNECTION_STATUS:
      return handleUpdateConnectionStatus(state, action.payload);

    case types.FETCH_CHANNEL_REQUEST:
      return handleFetchChannelRequest(state, action.payload);

    case types.FETCH_CHANNEL_SUCCESS:
      return handleFetchChannelSuccess(state, action.payload);

    case types.FETCH_CHANNEL_FAILURE:
      return handleFetchChannelFailure(state, action.payload);

    case types.FETCH_CURRENT_USER_REQUEST:
      return handleFetchCurrentUserRequest(state, action.payload);

    case types.FETCH_CURRENT_USER_SUCCESS:
      return handleFetchCurrentUserSuccess(state, action.payload);

    case types.FETCH_CURRENT_USER_FAILURE:
      return handleFetchCurrentUserFailure(state, action.payload);

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

function handleUpdateConnectionStatus(state, payload) {
  return update(state, { meta: { connectionStatus: { $set: payload.connectionStatus } } });
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
          author: { username: message.author.username },
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
      description: { $set: payload.description },
      description_html: { $set: payload.description_html },
      contributors_html: { $set: payload.contributors_html },
    },
    messages: {
      $merge: messages,
    },
  });
}

function handleFetchChannelFailure(state, payload) {
  return update(state, { meta: { isFetching: { $set: false } } });
}

function handleFetchCurrentUserRequest(state) {
  return update(state, { currentUser: { isFetching: { $set: true } } });
}

function handleFetchCurrentUserSuccess(state, payload) {
  return update(state, {
    currentUser: {
      isFetching: { $set: false },
      username: { $set: payload.username },
      perms: { $set: payload.channel_permissions },
    },
  });
}

function handleFetchCurrentUserFailure(state, payload) {
  return update(state, { currentUser: { isFetching: { $set: false } } });
}
