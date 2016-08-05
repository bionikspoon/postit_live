import * as types from '../constants/LiveActionTypes';
import { parseResponse, checkStatus, FETCH_OPTIONS } from '../utils/fetch';

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

export function updateConnectionStatus(payload) {
  return { type: types.UPDATE_CONNECTION_STATUS, payload };
}

export function fetchChannel(payload) {
  return dispatch => {
    dispatch({ type: types.FETCH_CHANNEL_REQUEST });

    const { slug, location } = payload;
    const endpoint = `${location.origin}/api/live/channels/${slug}/`;

    fetch(endpoint, FETCH_OPTIONS)
      .then(checkStatus)
      .then(parseResponse)
      .then(data => {
        dispatch({ type: types.FETCH_CHANNEL_SUCCESS, payload: data });
      })
      .catch(error => {
        dispatch({ type: types.FETCH_CHANNEL_FAILURE, error });
      });
  };
}

export function fetchCurrentUser(payload) {
  return dispatch => {
    dispatch({ type: types.FETCH_CURRENT_USER_REQUEST });

    const { slug, location } = payload;
    const endpoint = `${location.origin}/api/users/current/?channel_slug=${slug}`;

    fetch(endpoint, FETCH_OPTIONS)
      .then(checkStatus)
      .then(parseResponse)
      .then(data => {
        dispatch({ type: types.FETCH_CURRENT_USER_SUCCESS, payload: data });
      })
      .catch(error => {
        dispatch({ type: types.FETCH_CURRENT_USER_FAILURE, error });
      });
  };
}
