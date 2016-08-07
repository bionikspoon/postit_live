import { createAction, handleActions } from 'redux-actions';
import { parseResponse, checkStatus, FETCH_OPTIONS } from '../../utils/fetch';
import update from 'react-addons-update';
import _ from 'lodash';
import { CONNECTION_CLOSED } from '../../constants/ConnectionStatus';
import { CHANNEL_OPENED } from '../../constants/ChannelStatus';
const debug = require('debug')('app:modules:live:index');  // eslint-disable-line no-unused-vars

const CREATE_MESSAGE = 'app/live/message/CREATE_MESSAGE';
export const createMessage = createAction(CREATE_MESSAGE);

const STRIKE_MESSAGE = 'app/live/message/STRIKE_MESSAGE';
export const strikeMessage = createAction(STRIKE_MESSAGE);

const DELETE_MESSAGE = 'app/live/message/DELETE_MESSAGE';
export const deleteMessage = createAction(DELETE_MESSAGE);

const UPDATE_CHANNEL = 'app/live/channel/UPDATE_CHANNEL';
export const updateChannel = createAction(UPDATE_CHANNEL);

const FETCH_CHANNEL = 'app/live/channel/FETCH_CHANNEL';
export const fetchChannel = createAction(FETCH_CHANNEL, ({ location, slug }) =>
  fetch(`${location.origin}/api/live/channels/${slug}/`, FETCH_OPTIONS)
    .then(checkStatus)
    .then(parseResponse)
);

const FETCH_CURRENT_USER = 'app/live/currentUser/FETCH_CURRENT_USER';
export const fetchCurrentUser = createAction(FETCH_CURRENT_USER, ({ location, slug }) =>
  fetch(`${location.origin}/api/users/current/?channel_slug=${slug}`, FETCH_OPTIONS)
    .then(checkStatus)
    .then(parseResponse)
);

const UPDATE_CONNECTION_STATUS = 'app/live/connectionStatus/UPDATE_CONNECTION_STATUS';
export const updateConnectionStatus = createAction(UPDATE_CONNECTION_STATUS);

const ADD_CONTRIBUTOR = 'app/live/contributor/ADD_CONTRIBUTOR';
export const addContributor = createAction(ADD_CONTRIBUTOR);

const UPDATE_CONTRIBUTOR = 'app/live/contributor/UPDATE_CONTRIBUTOR';
export const updateContributor = createAction(UPDATE_CONTRIBUTOR);

const DELETE_CONTRIBUTOR = 'app/live/contributor/DELETE_CONTRIBUTOR';
export const deleteContributor = createAction(DELETE_CONTRIBUTOR);

export default handleActions({
  [createMessage]: (state, { payload: { message } }) =>
    update(state, { messages: { [message.id]: { $set: message } } }),

  [strikeMessage]: (state, { payload: { id } }) =>
    update(state, { messages: { [id]: { status: { $set: 'stricken' } } } }),

  [deleteMessage]: (state, { payload: { id } }) =>
    update(state, { messages: { $set: _.omit(state.messages, [id]) } }),

  [updateChannel]: (state, { payload }) =>
    update(state, { channel: { $merge: payload } }),

  [fetchChannel]: (state, { payload }) => {
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
        $merge: _.pick(payload, [
          'title', 'resources', 'resources_html', 'description', 'description_html', 'contributors_html',
        ]),
      },
      contributors: {
        $merge: payload.contributors || {},
      },
      messages: {
        $merge: messages,
      },
    });
  },

  [fetchCurrentUser]: (state, { payload }) =>
    update(state, {
      currentUser: {
        isFetching: { $set: false },
        username: { $set: payload.username },
        channel_permissions: { $set: payload.channel_permissions },
      },
    }),

  [updateConnectionStatus]: (state, { payload: { connectionStatus } }) =>
    update(state, { meta: { connectionStatus: { $set: connectionStatus } } }),

  [addContributor]: (state, { payload }) =>
    update(state, { contributors: { [payload.username]: { $set: payload } } }),

  [updateContributor]: (state, { payload }) =>
    update(state, { contributors: { [payload.username]: { $merge: payload } } }),

  [deleteContributor]: (state, { payload }) =>
    update(state, { contributors: { $set: _.omit(state.contributors, [payload.username]) } }),
}, initialState());

function initialState() {
  return {
    meta: {
      synced: false,
      connectionStatus: CONNECTION_CLOSED,
    },

    channel: {
      subscribers: 0,
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

    contributors: {},

    messages: {},

    currentUser: {
      username: '',
      channel_permissions: [],
    },
  };
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
      $merge: _.pick(payload, [
        'title', 'resources', 'resources_html', 'description', 'description_html', 'contributors_html',
      ]),
    },
    contributors: {
      $apply: setContributors(payload.contributors),
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
      channel_permissions: { $set: payload.channel_permissions },
    },
  });
}

function handleFetchCurrentUserFailure(state, payload) {
  return update(state, { currentUser: { isFetching: { $set: false } } });
}

function handleAddContributor(state, payload) {
  return update(state, {
    contributors: {
      $apply: setContributors([payload.contributor]),
    },
  });
}

function handleUpdateContributor(state, payload) {
  return state;
}

function handleDeleteContributor(state, payload) {
  return state;
}

function setContributors(payloadContributors = []) {
  return stateContributors => {
    const newContributors = payloadContributors.map(_.partialRight(_.pick, ['id', 'username', 'channel_permissions']));
    return _.uniqBy(stateContributors.concat(newContributors), 'id');
  };
}
