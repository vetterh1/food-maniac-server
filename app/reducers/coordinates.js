const coordinates = (state = {}, action) => {
	switch (action.type) {
		case 'SET_CURRENT_LOCATION':
			let changed = 	action.latitude === action.latitude && 
							state.longitude === action.longitude 
							? false : true;
			return {
				latitude: action.latitude,
				longitude: action.longitude,
				real: action.real,
				changed: changed
			}

		default:
			return state
	}
}

export default coordinates