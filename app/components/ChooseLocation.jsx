import React from 'react';
import Geolocation from './Geolocation';
import DisplayPositionFromStore from '../tests/DisplayPositionFromStore';
import PlacesContainer from '../containers/PlacesContainer';

const ChooseLocation = () => <div>
  <h1>Choose location</h1>
  <Geolocation />
  <DisplayPositionFromStore />
  <PlacesContainer />
</div>;

export default ChooseLocation;
