/* eslint-disable no-class-assign */
/* eslint-disable react/forbid-prop-types */

import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SimulateLocationModal from './SimulateLocationModal';
import * as CoordinatesActions from '../../actions/CoordinatesActions';

// require('es6-promise').polyfill();
// require('isomorphic-fetch');
import { polyfill } from 'es6-promise';
import 'isomorphic-fetch';

const logSimulateLocationContainer = log.getLogger('logSimulateLocationContainer');
logSimulateLocationContainer.setLevel('warn');
logSimulateLocationContainer.debug('--> entering SimulateLocationContainer.jsx');

class SimulateLocationContainer extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    // Injected by redux-store connect:
    dispatch: PropTypes.func.isRequired,
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
  }

  onCancel() {
    this.props.onClose();
  }

  onSubmit(data) {
    const { dispatch } = this.props;  // Injected by react-redux
    const action = CoordinatesActions.setSimulatedMode(data.coordinates.latitude, data.coordinates.longitude);
    dispatch(action);
    this.props.onClose();
  }


  render() {
    return (
      <SimulateLocationModal
        open={this.props.open}
        onSubmit={this.onSubmit.bind(this)}
        onCancel={this.onCancel.bind(this)}
        coordinates={this.props.coordinates}
      />
    );
  }

}

const mapStateToProps = (state) => { return { coordinates: state.coordinates }; };
export default connect(mapStateToProps)(SimulateLocationContainer);
