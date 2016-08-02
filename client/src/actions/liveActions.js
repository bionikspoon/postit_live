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

export function fetchMessages(payload) {
  return dispatch => {
    dispatch({ type: types.FETCH_MESSAGES_REQUEST });

    const { slug, location } = payload;
    const endpoint = `${location.origin}/api/live/channels/${slug}/`;
    console.log("endpoint", endpoint);

    fetch(endpoint)
      .then(response => response.json())
      .then(data => {
        dispatch({ type: types.FETCH_MESSAGES_SUCCESS, payload: data });
      })
      .catch(error => {
        dispatch({ type: types.FETCH_MESSAGES_FAILURE, error });
      });
  };
}
