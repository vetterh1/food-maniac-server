import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as CoordinatesActions from '../../actions/CoordinatesActions';
import GeolocationDisplay from './GeolocationDisplay';

function getPosition(position) {
  const { dispatch } = this.props;  // Injected by react-redux
  const action = CoordinatesActions.setCurrentLocation(position.coords.latitude, position.coords.longitude, true);
  dispatch(action);
}

/*
  showError: function (error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
    }
  }
*/

function errorPosition(/* error */) {
}



class Geolocation extends Component {

  constructor() {
    super();
    this.watchID = null;
  }

  componentDidMount() {
    this.watchID = navigator.geolocation.watchPosition(
      getPosition.bind(this),
      errorPosition.bind(this),
      { enableHighAccuracy: true, timeout: 3000, maximumAge: 3000 }
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  render() {
    return (
      <GeolocationDisplay />
    );
  }
}

Geolocation = connect()(Geolocation); // eslint-disable-line no-class-assign

export default Geolocation;
