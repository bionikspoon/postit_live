import { createAction, handleActions } from 'redux-actions';
import { parseResponse, checkStatus, FETCH_OPTIONS } from '../../utils/fetch';
import update from 'react-addons-update';
import _ from 'lodash';
import { CONNECTION_CLOSED } from '../../constants/connectionStatus';
import { CHANNEL_OPENED } from '../../constants/channelStatus';
const debug = require('debug')('app:modules:live:index');  // eslint-disable-line no-unused-vars

const CREATE_MESSAGE = 'app/live/message/CREATE_MESSAGE';
export const createMessage = createAction(CREATE_MESSAGE);

const UPDATE_MESSAGE = 'app/live/message/UPDATE_MESSAGE';
export const updateMessage = createAction(UPDATE_MESSAGE);

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

export function socketMessage({ action, data, model, pk }) {
  return dispatch => {
    debug('action=%s model=%s pk=%s data=', action, model, pk, data);
    const methods = {
      'live.livemessage': {
        create: createMessage,
        update: updateMessage,
        delete: deleteMessage,
      },
      'live.livechannel': {
        update: updateChannel,
      },
    };

    const method = methods[model][action];
    dispatch(method({ pk, data }));
  };
}

export default handleActions({
  [createMessage]: (state, { payload: { pk, data } }) =>
    update(state, { messages: { [pk]: { $set: data } } }),

  [updateMessage]: (state, { payload: { pk, data } }) =>
    update(state, { messages: { [pk]: { $merge: data } } }),

  [deleteMessage]: (state, { payload: { pk } }) =>
    update(state, { messages: { $set: _.omit(state.messages, [pk]) } }),

  [updateChannel]: (state, { payload: { data } }) =>
    update(state, {
      channel: { $merge: _.omit(data, ['contributors']) },
      contributors: {
        $set: data.contributors.reduce(
          (all, user) => update(all, { [user.username]: { $set: user } }),
          {}
        ),
      },
    }),

  [fetchChannel]: (state, { payload }) => {
    const messages = payload.messages.reduce((obj, message) =>
      update(obj, {
        [message.pk]: {
          $set: {
            author: { username: message.author.username },
            body: message.body,
            body_html: message.body_html,
            created: message.created,
            status: message.status,
            pk: message.pk,
          },
        },
      }), {});

    return update(state, {
      meta: {
        synced: { $set: true },
      },
      channel: {
        $merge: _.pick(payload, [
          'title', 'resources', 'resources_html', 'description', 'description_html',
        ]),
      },
      contributors: {
        $merge: payload.contributors.reduce(
          (all, user) => update(all, { [user.username]: { $set: _.pick(user, ['username', 'channel_permissions']) } }),
          {}
        ),
      },
      messages: {
        $merge: messages,
      },
    });
  },

  [fetchCurrentUser]: (state, { payload }) =>
    update(state, {
      currentUser: {
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
      [message.pk]: {
        $set: {
          author: { username: message.author.username },
          body: message.body,
          body_html: message.body_html,
          created: message.created,
          status: message.status,
          pk: message.pk,
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
    const newContributors = payloadContributors.map(_.partialRight(_.pick, ['pk', 'username', 'channel_permissions']));
    return _.uniqBy(stateContributors.concat(newContributors), 'pk');
  };
}
