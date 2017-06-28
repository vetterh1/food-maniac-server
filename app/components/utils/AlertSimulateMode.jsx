import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const divStyle = {
  color: 'darkslategrey',
  fontSize: '1rem',
  padding: '0.5em 1em',
  backgroundColor: 'lightblue',
  fontWeight: '500',
};

class AlertSimulateMode extends React.Component {

  render() {
    // Not in simulated mode: don't show anything!
    if (!this.props.coordinates.simulated) return null;

    return (
      <div style={divStyle}>
      Simulate mode ON!
      </div>
    );
  }
}

const mapStateToProps = (state) => { return { coordinates: state.coordinates }; };

AlertSimulateMode.propTypes = {
  coordinates: PropTypes.object.isRequired,
};

AlertSimulateMode = connect(mapStateToProps)(AlertSimulateMode);
export default AlertSimulateMode;
