import * as c from '../utils/constants';

function requestCategories() { return { type: c.REQUEST_CATEGORIES }; }
function receiveCategories(json) { return { type: c.RECEIVE_CATEGORIES, categories: json.categories }; }
function errorRequestingCategories(message) { return { type: c.ERROR_REQUESTING_CATEGORIES, error: message }; }

export function fetchCategories() { // eslint-disable-line import/prefer-default-export
  return (dispatch) => {
    dispatch(requestCategories()); // advertise we are starting a server request
    return fetch('/api/categories')
      .then(response => response.json())
      .then(json => dispatch(receiveCategories(json)))
      .catch(error => dispatch(errorRequestingCategories(error.message)));
  };
}
