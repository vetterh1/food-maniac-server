// Loacation actions
export const SET_CURRENT_LOCATION = 'SET_CURRENT_LOCATION';

export const SET_CURRENT_PLACES = 'SET_CURRENT_PLACES';

export const REQUEST_KINDS = 'REQUEST_KINDS';
export const RECEIVE_KINDS = 'RECEIVE_KINDS';
export const ERROR_REQUESTING_KINDS = 'ERROR_REQUESTING_KINDS';

export const REQUEST_CATEGORIES = 'REQUEST_CATEGORIES';
export const RECEIVE_CATEGORIES = 'RECEIVE_CATEGORIES';
export const ERROR_REQUESTING_CATEGORIES = 'ERROR_REQUESTING_CATEGORIES';



//
// Fetch items from Server to Redux store (in Action)
//

export const REQUEST_ITEMS = 'REQUEST_ITEMS';
export const RECEIVE_ITEMS = 'RECEIVE_ITEMS';
export const ERROR_REQUESTING_ITEMS = 'ERROR_REQUESTING_ITEMS';

//
// Save item to Server (in Action) and update Redux store with new item (in Reducer)
//

export const REQUEST_SAVE_ITEM = 'REQUEST_SAVE_ITEM';
export const SAVE_ITEM_OK = 'SAVE_ITEM_OK';
export const SAVE_ITEM_KO = 'SAVE_ITEM_KO';

//
// Update item to Server (in Action) and update Redux store with updated item (in Reducer)
//

export const REQUEST_UPDATE_ITEM = 'REQUEST_UPDATE_ITEM';
export const UPDATE_ITEM_OK = 'UPDATE_ITEM_OK';
export const UPDATE_ITEM_KO = 'UPDATE_ITEM_KO';

//
// Delete item on Server (in Action) and update Redux store by deleting the item (in Reducer)
//

export const REQUEST_DELETE_ITEM = 'REQUEST_DELETE_ITEM';
export const DELETE_ITEM_OK = 'DELETE_ITEM_OK';
export const DELETE_ITEM_KO = 'DELETE_ITEM_KO';



