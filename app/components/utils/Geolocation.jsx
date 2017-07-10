import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as CoordinatesActions from '../../actions/CoordinatesActions';
import GeolocationDisplay from './GeolocationDisplay';

const MIN_SECONDS_BETWEEN_UPDATES = 8;


class Geolocation extends Component {

  constructor() {
    super();
    this.watchID = null;
    this.state = {
      timeUpdate: 0,
    };
  }

  componentDidMount() {
    this.watchID = navigator.geolocation.watchPosition(
      this.getPosition.bind(this),
      this.errorPosition.bind(this),
      { enableHighAccuracy: true, timeout: 3000, maximumAge: 3000 }
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }


  getPosition(position) {
    //
    // No update if too close from last one...
    //

    const now = Date.now();
    const nbSecondsSinceLastUpdate = (now - this.state.timeUpdate) / 1000;
    if (nbSecondsSinceLastUpdate < MIN_SECONDS_BETWEEN_UPDATES) {
      console.log('Geolocation optim:  NO update: not enough time since previous one');
      return;
    }
    this.setState({ timeUpdate: now });



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

  errorPosition(/* error */) {
  }




  render() {
    return (
      <GeolocationDisplay />
    );
  }
}

Geolocation = connect()(Geolocation); // eslint-disable-line no-class-assign

export default Geolocation;
