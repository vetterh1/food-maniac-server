import * as c from '../utils/constants';

function requestKinds() { return { type: c.REQUEST_KINDS }; }
function receiveKinds(json) { return { type: c.RECEIVE_KINDS, kinds: json.kinds }; }
function errorRequestingKinds(message) { return { type: c.ERROR_REQUESTING_KINDS, error: message }; }

export function fetchKinds() { // eslint-disable-line import/prefer-default-export
  return (dispatch) => {
    dispatch(requestKinds()); // advertise we are starting a server request
    return fetch('/api/kinds')
      .then(response => response.json())
      .then(json => dispatch(receiveKinds(json)))
      .catch(error => dispatch(errorRequestingKinds(error.message)));
  };
}
