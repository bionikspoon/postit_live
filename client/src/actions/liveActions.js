import * as types from '../constants/LiveActionTypes';

export function createMessage(body) {
  return { type: types.CREATE, body };
}

export function strikeMessage(id) {
  return { type: types.STRIKE, id };
}

export function deleteMessage(id) {
  return { type: types.DELETE, id };
}
