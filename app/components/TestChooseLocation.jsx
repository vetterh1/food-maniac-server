import React from 'react';
import Geolocation from './Geolocation';
import DisplayPositionFromStore from '../tests/TestDisplayPositionFromStore';
import PlacesContainer from '../containers/PlacesContainer';

const ChooseLocation = () => <div>
  <Geolocation />
  <DisplayPositionFromStore />
  <PlacesContainer />
</div>;

export default ChooseLocation;
