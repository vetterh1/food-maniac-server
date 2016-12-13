import React, { Component } from 'react';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as LocationActions from '../actions/LocationActions';
import IconLocation from 'material-ui/svg-icons/communication/location-on';
import Popover from 'material-ui/Popover';


const styles = {
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
    latitude: React.PropTypes.number,
    longitude: React.PropTypes.number,
    real: React.PropTypes.boolean,
    nbRefreshes: React.PropTypes.number,
    nbDiffs: React.PropTypes.number,
    nbReal: React.PropTypes.number,
    nbEstimated: React.PropTypes.number,
    errorCode: React.PropTypes.number,
  }

  constructor() {
    super();

    this.state = {
      open: false,
    };
    // this._handleClick = this._handleClick.bind(this);
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

  render() {
    return (
      <div>
        <IconLocation
          style={this.props.real ? styles.locationOK : styles.locationKO}
          onTouchTap={this.handleTouchTap}
        />
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          onRequestClose={this.handleRequestClose}
        >
          <div className="geolocation_statistics">
            Coordinates:
            <ul>
              <li>Latitude: {this.props.latitude ? this.props.latitude : 'unknown'}</li>
              <li>Longitude: {this.props.longitude ? this.props.longitude : 'unknown'}</li>
              <li>Real: {this.props.real ? 'true' : 'false'}</li>
            </ul>
          </div>

          <div className="geolocation_statistics">
            Statistics:
            <ul>
              <li>Nb refreshes: {this.props.nbRefreshes}</li>
              <li>Nb different positions: {this.props.nbDiffs}</li>
              <li>Nb real positions: {this.props.nbReal}</li>
              <li>Nb estimated positions: {this.props.nbEstimated}</li>
              <li>Last error code: {this.props.errorCode}</li>
            </ul>
          </div>
        </Popover>
      </div>
    );
  }
}












function getPosition(position) {
  // alert("getPosition");
  const current = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    real: true,
  };
  const statistics = this.state.statistics;
  statistics.nbRefreshes += 1;
  statistics.nbReal += 1;
  if (current.latitude !== this.state.position.latitude ||
      current.longitude !== this.state.position.longitude) {
    statistics.nbDiffs += 1;
  }
  this.setState({
    position: current,
    statistics,
  });

  const { dispatch } = this.props;  // Injected by react-redux
  const action = LocationActions.setCurrentLocation(current.latitude, current.longitude, current.real);
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
  // alert("errorPosition");
  const position = this.state.position;
  const statistics = this.state.statistics;
  position.real = false;
  if (position.latitude != null && position.longitude != null) statistics.nbEstimated += 1;
  this.setState({
    position,
    statistics,
    errorCode: error.errorCode,
  });

  const { dispatch } = this.props;  // Injected by react-redux
  const action = LocationActions.setCurrentLocation(position.latitude, position.longitude, false);
  dispatch(action);
}



class Geolocation extends Component {

  // watchID: (null: ?number),


  state = {
    position: { latitude: 50.5467501, longitude: 3.0290698999999996, real: false },
    statistics: { nbRefreshes: 0, nbDiffs: 0, nbReal: 0, nbEstimated: 0 },
    errorCode: 0,
  }

  componentDidMount() {
    // alert("componentDidMount");
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
    const displayLatitude = Math.round(this.state.position.latitude * 10000) / 10000;
    const displayLongitude = Math.round(this.state.position.longitude * 10000) / 10000;
    return (
      <GeolocationDisplay
        latitude={displayLatitude}
        longitude={displayLongitude}
        real={this.state.position.real}
        nbRefreshes={this.state.statistics.nbRefreshes}
        nbDiffs={this.state.statistics.nbDiffs}
        nbReal={this.state.statistics.nbReal}
        nbEstimated={this.state.statistics.nbEstimated}
        errorCode={this.state.errorCode}
      />
    );
  }
}

Geolocation = connect()(Geolocation); // eslint-disable-line no-class-assign

export default Geolocation;
