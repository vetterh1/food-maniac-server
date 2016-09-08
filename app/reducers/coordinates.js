const coordinates = (state = {}, action) => {
	switch (action.type) {
		case 'SET_CURRENT_LOCATION':
			let changed = 	action.latitude === action.latitude && 
							state.longitude === action.longitude 
							? false : true;
			return changed ? {
				latitude: action.latitude,
				longitude: action.longitude,
				real: action.real,
				changed: changed
			} : state;

		default:
			return state
	}
}

export default coordinates