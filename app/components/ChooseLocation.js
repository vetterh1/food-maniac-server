import React from 'react';
import Geolocation from './Geolocation';
import DisplayPositionFromStore from '../tests/DisplayPositionFromStore.jsx';
import PlacesContainer from '../containers/PlacesContainer.jsx';

const ChooseLocation = (props) => <div>
	                        <h1>Choose location</h1>
	                        <Geolocation />
	                        <DisplayPositionFromStore />
	                        <PlacesContainer />
                       </div>;

export default ChooseLocation;
