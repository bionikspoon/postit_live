import * as types from '../constants/LiveActionTypes';

export function createMessage(payload) {
  return { type: types.CREATE, payload };
}

export function strikeMessage(payload) {
  return { type: types.STRIKE, payload };
}

export function deleteMessage(payload) {
  return { type: types.DELETE, payload };
}
