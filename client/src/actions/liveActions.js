import * as types from '../constants/LiveActionTypes';
import { parseResponse, checkStatus, FETCH_OPTIONS } from '../utils/fetch';

export function createMessage(payload) {
  return { type: types.CREATE, payload };
}

export function strikeMessage(payload) {
  return { type: types.STRIKE, payload };
}

export function deleteMessage(payload) {
  return { type: types.DELETE, payload };
}

export function updateChannel(payload) {
  return { type: types.UPDATE_CHANNEL, payload };
}

export function fetchMessages(payload) {
  return dispatch => {
    dispatch({ type: types.FETCH_MESSAGES_REQUEST });

    const { slug, location } = payload;
    const endpoint = `${location.origin}/api/live/channels/${slug}/`;

    fetch(endpoint, FETCH_OPTIONS)
      .then(checkStatus)
      .then(parseResponse)
      .then(data => {
        dispatch({ type: types.FETCH_MESSAGES_SUCCESS, payload: data });
      })
      .catch(error => {
        dispatch({ type: types.FETCH_MESSAGES_FAILURE, error });
      });
  };
}
