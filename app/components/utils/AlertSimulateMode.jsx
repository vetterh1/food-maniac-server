import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import * as CoordinatesActions from '../../actions/CoordinatesActions';

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

class AlertSimulateMode extends React.Component {

  // Tell Redux store to stop the simulated location
  dispatchStopSimulatedAction = () => {
    const { dispatch } = this.props;  // Injected by react-redux
    const action = CoordinatesActions.stopSimulatedMode();
    dispatch(action);
  };

  render() {
    // Not in simulated mode: don't show anything!
    if (!this.props.coordinates.simulated) return null;

    return (
      <div style={divStyle}>
        <Button style={linkStyle} color="link" onClick={this.dispatchStopSimulatedAction.bind(this)} size="md">Return to real location</Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => { return { coordinates: state.coordinates }; };

AlertSimulateMode.propTypes = {
  coordinates: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(AlertSimulateMode);
