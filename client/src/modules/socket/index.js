import { createAction, handleActions } from 'redux-actions';
const debug = require('debug')('app:modules:socket:index');  // eslint-disable-line no-unused-vars

const CREATE_MESSAGE = 'app/socket/message/CREATE_MESSAGE';
export const createMessage = createAction(CREATE_MESSAGE, (
  ({ body }) => ({
    stream: 'LiveMessage',
    payload: {
      action: 'create',
      data: { body },
    },
  })
));

const STRIKE_MESSAGE = 'app/socket/message/STRIKE_MESSAGE';
export const strikeMessage = createAction(STRIKE_MESSAGE);

const DELETE_MESSAGE = 'app/socket/message/DELETE_MESSAGE';
export const deleteMessage = createAction(DELETE_MESSAGE);

const UPDATE_CHANNEL = 'app/socket/channel/UPDATE_CHANNEL';
export const updateChannel = createAction(UPDATE_CHANNEL);

const ADD_CONTRIBUTOR = 'app/socket/contributor/ADD_CONTRIBUTOR';
export const addContributor = createAction(ADD_CONTRIBUTOR);

const UPDATE_CONTRIBUTOR = 'app/socket/contributor/UPDATE_CONTRIBUTOR';
export const updateContributor = createAction(UPDATE_CONTRIBUTOR);

const DELETE_CONTRIBUTOR = 'app/socket/contributor/DELETE_CONTRIBUTOR';
export const deleteContributor = createAction(DELETE_CONTRIBUTOR);

export default handleActions({});
