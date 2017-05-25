import * as c from '../utils/constants';

const initialState = { // define initial state - an empty items list
  items: [],
  isFetching: false,
  isValid: true,
  error: null,
};

const itemsReducer = (state = initialState, action) => {
  switch (action.type) {

  case c.REQUEST_ITEMS: return Object.assign({}, state, { isFetching: true, isValid: false, error: null });
  case c.RECEIVE_ITEMS: return Object.assign({}, state, { isFetching: false, isValid: true, error: null, items: action.items });
  case c.ERROR_REQUESTING_ITEMS: return Object.assign({}, state, { isFetching: false, isValid: false, error: action.error, items: [] });

  case c.REQUEST_SAVE_ITEM: return Object.assign({}, state, { isSaving: true, error: null });
  case c.SAVE_ITEM_OK: {
    // Add the new item to the redux store so we don't need to reload from server to access it
    const newItems = [action.item, ...state.items]
    const newState = { ...state, isSaving: false, error: null, items: newItems };
    console.log('itemsReducer - newState=', newState);
    return newState;
  }
  case c.SAVE_ITEM_KO: return Object.assign({}, state, { isSaving: false, error: action.error });

  default: return state;
  }
};

export default itemsReducer;