import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import * as CoordinatesActions from '../../actions/CoordinatesActions';

const PositionError = {
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3,
};

const divStyle = {
  display: 'flex',
  padding: '0.5em',
  backgroundColor: 'lightblue',
};

const linkStyle = {
  marginLeft: 'auto',
  color: 'darkslategrey',
  fontSize: '1rem',
  fontWeight: '500',
};

class AlertGeolocalisation extends React.Component {

  // Tell Redux store to stop the simulated location
  dispatchStopSimulatedAction = () => {
    const { dispatch } = this.props;  // Injected by react-redux
    const action = CoordinatesActions.stopSimulatedMode();
    dispatch(action);
  };

  render() {
    // If geolocalisation error: show a message!
    if (this.props.coordinates.error) {
      let message;
      switch (this.props.coordinates.error) {
      case PositionError.PERMISSION_DENIED:
        message = 'User denied the request for Geolocation.';
        break;
      case PositionError.POSITION_UNAVAILABLE:
        message = 'Location information is unavailable.';
        break;
      case PositionError.TIMEOUT:
        message = 'The request to get user location timed out.';
        break;
      case PositionError.UNKNOWN_ERROR:
        message = 'An unknown error occurred.';
        break;
      default:
        message = 'An unknown error occurred (2)';
        break;
      }

      return (
        <div style={divStyle}>
          Error: {message}
        </div>
      );
    }

    // In simulated mode: show a message!
    if (this.props.coordinates.simulated) {
      return (
        <div style={divStyle}>
          <Button style={linkStyle} color="link" onClick={this.dispatchStopSimulatedAction.bind(this)} size="md">Return to real location</Button>
        </div>
      );
    }

    return null;
  }
}

const mapStateToProps = (state) => { return { coordinates: state.coordinates }; };

AlertGeolocalisation.propTypes = {
  coordinates: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(AlertGeolocalisation);
