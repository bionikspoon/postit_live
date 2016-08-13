import { createAction, handleActions } from 'redux-actions';
import _ from 'lodash';

const debug = require('debug')('app:modules:socket:index');  // eslint-disable-line no-unused-vars

function createSocketAction(constant, stream, action, dataCB) {
  const getData = _.isFunction(dataCB) ? dataCB : () => dataCB;
  return createAction(constant, (
    ({ pk, ...data }) => ({
      stream,
      payload: {
        action,
        pk,
        data: getData(data),
      },
    })
  ));
}

const CREATE_MESSAGE = 'app/socket/message/CREATE_MESSAGE';
export const createMessage = createSocketAction(
  CREATE_MESSAGE, 'LiveMessage', 'create', ({ body }) => ({ body })
);

const STRIKE_MESSAGE = 'app/socket/message/STRIKE_MESSAGE';
export const strikeMessage = createSocketAction(
  STRIKE_MESSAGE, 'LiveMessage', 'update', { status: 'stricken' }
);

const DELETE_MESSAGE = 'app/socket/message/DELETE_MESSAGE';
export const deleteMessage = createSocketAction(
  DELETE_MESSAGE, 'LiveMessage', 'delete'
);

const UPDATE_CHANNEL = 'app/socket/channel/UPDATE_CHANNEL';
export const updateChannel = createSocketAction(
  UPDATE_CHANNEL, 'LiveChannel', 'update', _.identity
);

const ADD_CONTRIBUTOR = 'app/socket/contributor/ADD_CONTRIBUTOR';
export const addContributor = createSocketAction(
  ADD_CONTRIBUTOR, 'LiveChannelContributor', 'create', _.identity
);

const UPDATE_CONTRIBUTOR = 'app/socket/contributor/UPDATE_CONTRIBUTOR';
export const updateContributor = createSocketAction(
  UPDATE_CONTRIBUTOR, 'LiveChannelContributor', 'update', _.identity
);

const DELETE_CONTRIBUTOR = 'app/socket/contributor/DELETE_CONTRIBUTOR';
export const deleteContributor = createSocketAction(
  DELETE_CONTRIBUTOR, 'LiveChannelContributor', 'delete', _.identity
);

export default handleActions({});
