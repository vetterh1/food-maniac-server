/* eslint-disable react/no-multi-comp */
/* eslint-disable react/prop-types */

import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import MdLocationOn from 'react-icons/lib/md/location-on';
import { connect } from 'react-redux';
import * as CoordinatesActions from '../../actions/CoordinatesActions';
import TestDisplayPositionFromStore from './TestDisplayPositionFromStore';


const styles = {

  locationOK: {
    color: 'green',
  },

  locationKO: {
    color: 'red',
  },
};


class GeolocationDisplay extends React.Component {
  static propTypes = {
  }

  constructor() {
    super();
    this.toggle = this.toggle.bind(this);

    this.state = {
      statisticsOpen: false,
    };
  }

  toggle() {
    this.setState({ statisticsOpen: !this.state.statisticsOpen });
  }

  render = () => {
    return (
      <div>
        <Button onClick={this.toggle} size="md" color="link" style={this.props.coordinates.real ? styles.locationOK : styles.locationKO}>
          <MdLocationOn size={18} />
        </Button>
        <Modal isOpen={this.state.statisticsOpen} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Geolocation Statistics</ModalHeader>
          <ModalBody>
            <div className="geolocation_statistics">
              Coordinates:
              <ul>
                <li>Latitude: {this.props.coordinates.latitude ? Math.round(this.props.coordinates.latitude * 100000) / 100000 : 'unknown'}</li>
                <li>Longitude: {this.props.coordinates.longitude ? Math.round(this.props.coordinates.longitude * 100000) / 100000 : 'unknown'}</li>
                <li>Real: {this.props.coordinates.real ? 'true' : 'false'}</li>
                <li>Changed: {this.props.coordinates.changed ? 'true' : 'false'}</li>
                <li>Changed (real): {this.props.coordinates.changedReal ? 'true' : 'false'}</li>
              </ul>
            </div>

            <div className="geolocation_statistics">
              Statistics:
              <ul>
                <li>Nb refreshes: {this.props.coordinates.nbRefreshes}</li>
                <li>Nb different positions: {this.props.coordinates.nbDiffs}</li>
                <li>Nb real positions: {this.props.coordinates.nbReal}</li>
                <li>Nb estimated positions: {this.props.coordinates.nbEstimated}</li>
                <li>Nb closed positions: {this.props.coordinates.nbClose}</li>
              </ul>
            </div>

            <div className="geolocation_statistics">
              Simulation:
              <TestDisplayPositionFromStore onClick={this.toggle} />
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }

}


// 1st to receive store changes
// Role of mapStateToProps: transform the "interesting" part of the store state
// into some props that will be received by componentWillReceiveProps
const mapStateToProps = (state) => { return { coordinates: state.coordinates }; };


GeolocationDisplay = connect(mapStateToProps)(GeolocationDisplay); // eslint-disable-line no-class-assign














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
