import * as log from 'loglevel';
import * as c from '../utils/constants';


const logKindsReducer = log.getLogger('logKindsReducer');
logKindsReducer.setLevel('debug');
logKindsReducer.debug('--> entering kindsReducer.js');

const initialState = { // define initial state - an empty kinds list
  kinds: [],
  isFetching: false,
  isValid: true,
  error: null,
};

const kindsReducer = (state = initialState, action) => {
  switch (action.type) {
  case c.REQUEST_KINDS: return Object.assign({}, state, { isFetching: true, isValid: false, error: null });
  case c.RECEIVE_KINDS: return Object.assign({}, state, { isFetching: false, isValid: true, error: null, kinds: action.kinds });
  case c.ERROR_REQUESTING_KINDS: return Object.assign({}, state, { isFetching: false, isValid: false, error: action.error, kinds: [] });
  default: return state;
  }
};

export default kindsReducer;


/*

// Example of minimal reducers & hydrate (reloading of store)

const { combineReducers, createStore } = Redux;

const people = (state = [], action) => action.type === 'people' ? [...state, action.payload] : state;

const items = (state = [], action) => action.type === 'items' ? [...state, action.payload] : state;

const reducers = combineReducers({
  people,
  items
});

const mainReducer = (state = {}, action) => action.type === 'hydrate' ? action.payload : reducers(state, action);

const store = createStore(mainReducer);

store.subscribe(() => console.log(store.getState()));

store.dispatch({ type: 'people', payload: 5 });
store.dispatch({ type: 'items', payload: 'green' });
store.dispatch({ type: 'hydrate', payload: { 
  people: [20, 30, 50, 100],
  items: ['green', 'yellow', 'red']
}});
*/