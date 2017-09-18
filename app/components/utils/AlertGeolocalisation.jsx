import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
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
      let idError;
      switch (this.props.coordinates.error) {
      case PositionError.PERMISSION_DENIED:
        idError = 'PERMISSION_DENIED';
        break;
      case PositionError.POSITION_UNAVAILABLE:
        idError = 'POSITION_UNAVAILABLE';
        break;
      case PositionError.TIMEOUT:
        idError = 'TIMEOUT';
        break;
      case PositionError.UNKNOWN_ERROR:
        idError = 'UNKNOWN_ERROR';
        break;
      default:
        idError = 'default';
        break;
      }

      const errorLabel = this.context.intl.formatMessage({ id: `messages.geolocalisation.error.${idError}` });

      return (
        <div style={divStyle}>
          Error: {errorLabel}
        </div>
      );
    }

    // In simulated mode: show a message!
    if (this.props.coordinates.simulated) {
      return (
        <div style={divStyle}>
          <Button style={linkStyle} color="link" onClick={this.dispatchStopSimulatedAction.bind(this)} size="md"><FormattedMessage id="messages.geolocalisation.end.simulated" /></Button>
        </div>
      );
    }

    return null;
  }
}

const mapStateToProps = (state) => { return { coordinates: state.coordinates }; };

AlertGeolocalisation.propTypes = {
  coordinates: PropTypes.shape({
    error: PropTypes.number,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    simulated: PropTypes.boolean,
    real: PropTypes.boolean,
    changed: PropTypes.boolean,
    changedReal: PropTypes.boolean,
    nbRefreshes: PropTypes.number,
    nbDiffs: PropTypes.number,
    nbReal: PropTypes.number,
    nbEstimated: PropTypes.number,
    nbClose: PropTypes.number,
    latitude_save: PropTypes.number,
    longitude_save: PropTypes.number,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

AlertGeolocalisation.contextTypes = { intl: React.PropTypes.object.isRequired };

export default connect(mapStateToProps)(AlertGeolocalisation);
