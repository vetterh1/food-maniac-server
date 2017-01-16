import React, { Component } from 'react';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as LocationActions from '../actions/LocationActions';
import IconLocation from 'material-ui/svg-icons/communication/location-on';
import Popover from 'material-ui/Popover';
import TestDisplayPositionFromStore from '../tests/TestDisplayPositionFromStore';


const styles = {

  Popover: {
    padding: '1em',
  },

  locationOK: {
    color: 'green',
  },

  locationKO: {
    color: 'red',
  },

  statistics: {
    color: 'grey',
    marginTop: 40,
  },
};


class GeolocationDisplay extends React.Component {
  static propTypes = {
  }

  constructor() {
    super();
    this.handleTouchTap = this.handleTouchTap.bind(this);

    this.state = {
      open: false,
    };
  }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  render = () => {
    // const displayLatitude = Math.round(this.state.position.latitude * 10000) / 10000;
    // const displayLongitude = Math.round(this.state.position.longitude * 10000) / 10000;

    console.log('{   GeolocationDisplay.render (gldr)');
    console.log('       (gldr) props:', this.props);

    return (
      <div>
        <IconLocation
          style={this.props.coordinates.real ? styles.locationOK : styles.locationKO}
          onTouchTap={this.handleTouchTap}
        />
        <Popover
          style={styles.Popover}
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          onRequestClose={this.handleRequestClose}
        >
          <div className="geolocation_statistics">
            Coordinates:
            <ul>
              <li>Latitude: {this.props.coordinates.latitude ? this.props.coordinates.latitude : 'unknown'}</li>
              <li>Longitude: {this.props.coordinates.longitude ? this.props.coordinates.longitude : 'unknown'}</li>
              <li>Real: {this.props.coordinates.real ? 'true' : 'false'}</li>
            </ul>
          </div>

          <div className="geolocation_statistics">
            Statistics:
            <ul>
              <li>Nb refreshes: {this.props.coordinates.nbRefreshes}</li>
              <li>Nb different positions: {this.props.coordinates.nbDiffs}</li>
              <li>Nb real positions: {this.props.coordinates.nbReal}</li>
              <li>Nb estimated positions: {this.props.coordinates.nbEstimated}</li>
            </ul>
          </div>

          <div className="geolocation_statistics">
            Simulation:
            <TestDisplayPositionFromStore />
          </div>

        </Popover>
      </div>
    );
  }
}


// 1st to receive store changes
// Role of mapStateToProps: transform the "interesting" part of the store state
// into some props that will be received by componentWillReceiveProps
const mapStateToProps = function (state) {
  console.log('{   GeolocationDisplay.mapStateToProps (pcms)');
  console.log('       (pcms) state:', state);
  const result = {
    coordinates: state.coordinates,
  };
  console.log('       (pcms) result:', result);
  console.log('}   GeolocationDisplay.mapStateToProps');
  return result;
};

GeolocationDisplay = connect(mapStateToProps)(GeolocationDisplay); // eslint-disable-line no-class-assign














function getPosition(position) {
  const { dispatch } = this.props;  // Injected by react-redux
  const action = LocationActions.setCurrentLocation(position.coords.latitude, position.coords.longitude, true);
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

function errorPosition(error) {
}



class Geolocation extends Component {

  constructor() {
    super();
    this.watchID = null;
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      getPosition.bind(this),
      errorPosition.bind(this),
      { enableHighAccuracy: true, timeout: 3000, maximumAge: 3000 }
    );
    this.watchID = navigator.geolocation.watchPosition(
      getPosition.bind(this),
      errorPosition.bind(this)
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
