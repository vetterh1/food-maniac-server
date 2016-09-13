const coordinates = (state = {}, action) => {
	switch (action.type) {
		case 'SET_CURRENT_LOCATION':
			console.log("{   Reducer.coordinates.SET_CURRENT_LOCATION (rsl)" );

			let changed = 	action.latitude === action.latitude && 
							state.longitude === action.longitude 
							? false : true;

			console.log("       (rsl) previous state:", state);
			console.log("       (rsl) action:", action);

			if( !changed ) {
				console.log("       (rsl) === no change in state");
				console.log("}   Reducer.coordinates.SET_CURRENT_LOCATION" );
				return state;
			}

			const newState = { 	...state, 
								latitude: action.latitude,
								longitude: action.longitude,
								real: action.real,
								changed: changed 
			};

			/* Same as:
			var newState = Object.assign({}, state, { 
				latitude: action.latitude,
				longitude: action.longitude,
				real: action.real,
				changed: changed
			}); */

			console.log("       (rsl) newState:", newState);
			console.log("}   Reducer.coordinates.SET_CURRENT_LOCATION" );

			return newState;
		default:
			return state
	}
}

export default coordinates