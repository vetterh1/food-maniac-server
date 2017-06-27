/* eslint-disable no-class-assign */
/* eslint-disable react/forbid-prop-types */

import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Alert from 'react-s-alert';
import AddItemModal from './AddItemModal';
import * as itemsActions from '../../actions/itemsActions';
// import stringifyOnce from '../../utils/stringifyOnce';

require('es6-promise').polyfill();
require('isomorphic-fetch');

const logSimulateLocationContainer = log.getLogger('logSimulateLocationContainer');
logSimulateLocationContainer.setLevel('warn');
logSimulateLocationContainer.debug('--> entering SimulateLocationContainer.jsx');

class SimulateLocationContainer extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    // Injected by redux-store connect:
    kinds: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    items: PropTypes.object.isRequired, // load the object and not just the array (in the object) to get redux info (isSaving...)
  }

  constructor(props) {
    super(props);
    this.values = null;

    this._childComponent = null;

    this.alert = null;
  }


  onStartSaving = () => {
    this._nowStartSaving = new Date().getTime();
    this.alert = Alert.info('Saving...');
  }

  onEndSavingOK = () => {
    const durationSaving = new Date().getTime() - this._nowStartSaving;
    this.alert = Alert.success(`Saved! (duration=${durationSaving}ms)`);
  }

  onEndSavingFailed = (errorMessage) => {
    const durationSaving = new Date().getTime() - this._nowStartSaving;
    this.alert = Alert.error(`Error while saving (error=${errorMessage}, duration=${durationSaving}ms)`);
  }

  onSnapshotStartProcessing = () => {
    this._nowStartProcessing = new Date().getTime();
    this.alert = Alert.info('Processing snapshot...');
}

  onSnapshotError = (errorMessage) => {
    const durationSaving = new Date().getTime() - this._nowStartProcessing;
    this.alert = Alert.error(`Error while processing snapshot (error=${errorMessage}, duration=${durationSaving}ms)`);
  }

  onSnapshotReady = () => {
    const timeDiffTotal = new Date().getTime() - this._nowStartProcessing;
    this.alert = Alert.success(`Snapshot processed! (duration=${timeDiffTotal}ms)`);
  }


  onCancel() {
    this.props.onClose();
  }


  onSubmit(data) {
    this.onStartSaving();
    const { dispatch } = this.props;  // Injected by react-redux
    const action = itemsActions.saveItem(data);
    dispatch(action);
    this.props.onClose();
}



  componentWillReceiveProps(nextProps) {
    console.log('SimulateLocationContainer.componentWillReceiveProps - (nextProps, crtProps): ', nextProps, this.props);

    // Only consider the end of loading:
    // previous isSaving = true and
    // new isSaving = false
    if (!nextProps ||
      !nextProps.items ||
      !this.props.items ||
      this.props.items.isSaving !== true ||
      nextProps.items.isSaving !== false) return;

    if (nextProps.items.error === null) this.onEndSavingOK();
    else this.onEndSavingFailed(nextProps.items.error);
  }



  render() {
    return (
      <AddItemModal
        ref={(r) => { this._childComponent = r; }}
        open={this.props.open}
        kinds={this.props.kinds}
        categories={this.props.categories}
        items={this.props.items.items}
        onSubmit={this.onSubmit.bind(this)}
        onCancel={this.onCancel.bind(this)}
        onSnapshotStartProcessing={this.onSnapshotStartProcessing}
        onSnapshotError={this.onSnapshotError}
        onSnapshotReady={this.onSnapshotReady}
      />
    );
  }

}


const mapStateToProps = (state) => {
    console.log('SimulateLocationContainer.mapStateToProps - (state): ', state);

  // Add the All to the Kind & Category lists
  return {
    kinds: state.kinds.kinds,
    categories: state.categories.categories,
    items: state.items, // load the object and not just the array (in the object) to get redux info (isSaving...)
  };
};

SimulateLocationContainer = connect(mapStateToProps)(SimulateLocationContainer);
export default SimulateLocationContainer;
