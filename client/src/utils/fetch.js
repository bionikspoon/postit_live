export function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) return response;
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

export function parseResponse(response) { return response.json(); }

export const CREDENTIALS = { credentials: 'include' };

export const FETCH_OPTIONS = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  ...CREDENTIALS,
};
