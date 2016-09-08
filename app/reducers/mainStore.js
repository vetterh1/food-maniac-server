import { combineReducers } from 'redux'
import coordinates from './coordinates'
//import userInfo from './userInfo'

const mainStore = combineReducers({
  coordinates,
//  userInfo
})

export default mainStore