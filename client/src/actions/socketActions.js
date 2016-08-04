import * as types from '../constants/SocketActionTypes';

export function createMessage(payload) {
  return { type: types.CREATE_MESSAGE, payload };
}

export function strikeMessage(payload) {
  return { type: types.STRIKE_MESSAGE, payload };
}

export function deleteMessage(payload) {
  return { type: types.DELETE_MESSAGE, payload };
}


export function updateChannel(payload) {
  return { type: types.UPDATE_CHANNEL, payload };
}
