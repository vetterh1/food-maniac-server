/* eslint-disable no-class-assign */
/* eslint-disable react/forbid-prop-types */

import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';
import Alert from 'react-s-alert';
import AddItemForm from './AddItemForm';
import * as itemsActions from '../../actions/itemsActions';
// import stringifyOnce from '../../utils/stringifyOnce';

require('es6-promise').polyfill();
require('isomorphic-fetch');

const logAddItemContainer = log.getLogger('logAddItemContainer');
logAddItemContainer.setLevel('warn');
logAddItemContainer.debug('--> entering AddItemContainer.jsx');

class AddItemContainer extends React.Component {
  static propTypes = {
    // Injected by redux-store connect:
    kinds: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    items: PropTypes.object.isRequired,
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

    // Tell the child to reset
    // CAUTION! only works because the form is the immediate child
    // ...because it does NOT use redux not redux-form
    // if this CHANGES, this should be replaced by a dispatch or a reset action
    // ex: dispatch(reset('AddItemForm'));
    if (this._childComponent) this._childComponent.resetForm();
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



  onSubmit(data) {

    this.onStartSaving();
    const { dispatch } = this.props;  // Injected by react-redux
    const action = itemsActions.saveItem(data);
    dispatch(action);
/*
    console.log('AddItemContainer.onSubmit - 1', data);
    fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item: data }, null, 4),
    })
    .then((response) => {
      // console.log('fetch result: ', response);
      if (response && response.ok) {
        this.onEndSavingOK();
        // return response.blob();
        return;
      }
      this.onEndSavingFailed('01');
      const error = new Error('fetch OK but returned nothing or an error (request: post /api/items');
      error.name = 'ErrorCaught';
      throw (error);
    })
    .catch((error) => {
      if (error.name !== 'ErrorCaught') this.onEndSavingFailed('02');
      logAddItemContainer.error(error.message);
    });
*/    
  }



  componentWillReceiveProps(nextProps) {

    console.log('AddItemContainer.componentWillReceiveProps - (nextProps, crtProps): ', nextProps, this.props);

    // Only consider the end of loading:
    // previous isSaving = true and
    // new isSaving = false
    if (!nextProps ||
      !nextProps.items ||
      !this.props.items ||
      this.props.items.isSaving !== true ||
      nextProps.items.isSaving !== false) return;

    if(nextProps.items.error === null)
        this.onEndSavingOK();
    else
        this.onEndSavingFailed(nextProps.items.error);
  }



  render() {
    return (
      <Container fluid>
        <AddItemForm
          ref={(r) => { this._childComponent = r; }}
          kinds={this.props.kinds}
          categories={this.props.categories}
          items={this.props.items.items}
          onSubmit={this.onSubmit.bind(this)}
          onSnapshotStartProcessing={this.onSnapshotStartProcessing}
          onSnapshotError={this.onSnapshotError}
          onSnapshotReady={this.onSnapshotReady}
        />
      </Container>
    );
  }

}


const mapStateToProps = (state) => {
    console.log('AddItemContainer.mapStateToProps - (state): ', state);

  // Add the All to the Kind & Category lists
  return {
    kinds: state.kinds.kinds,
    categories: state.categories.categories,
    items: state.items,
  };
};

AddItemContainer = connect(mapStateToProps)(AddItemContainer);
export default AddItemContainer;
