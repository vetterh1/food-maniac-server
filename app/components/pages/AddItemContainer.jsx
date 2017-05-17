/* eslint-disable no-class-assign */
/* eslint-disable react/forbid-prop-types */

import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert, Container } from 'reactstrap';
import AddItemForm from './AddItemForm';
// import stringifyOnce from '../../utils/stringifyOnce';

require('es6-promise').polyfill();
require('isomorphic-fetch');

const logAddItemContainer = log.getLogger('logAddItemContainer');
logAddItemContainer.setLevel('debug');
logAddItemContainer.warn('--> entering AddItemContainer.jsx');

class AddItemContainer extends React.Component {
  static propTypes = {
    // Injected by redux-store connect:
    kinds: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    items: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
    this.values = null;

    this._childComponent = null;

    this.state = {
      // alertStatus possible values:
      // -  0: no alerts
      //  - saving alerts:  1: saving, 2: saving OK, -1: saving KO
      //  - snapshot alerts: 11: snapshot processing, 12: snapshot OK, -11: snapshot KO
      alertStatus: 0,
      alertMessage: '',
    };
  }


  onStartSaving = () => {
    this._nowStartSaving = new Date().getTime();
    this.setState({ alertStatus: 1, alertColor: 'info', alertMessage: 'Saving...' });
    window.scrollTo(0, 0);
  }

  onEndSavingOK = () => {
    const durationSaving = new Date().getTime() - this._nowStartSaving;
    this.setState({ alertStatus: 2, alertColor: 'success', alertMessage: `Saved! (duration=${durationSaving}ms)` });
    setTimeout(() => { this.setState({ alertStatus: 0 }); }, 3000);

    // Tell the child to reset
    // CAUTION! only works because the form is the immediate child
    // ...because it does NOT use redux not redux-form
    // if this CHANGES, this should be replaced by a dispatch or a reset action
    // ex: dispatch(reset('AddItemForm'));
    if (this._childComponent) this._childComponent.resetForm();
  }

  onEndSavingFailed = (errorMessage) => {
    const durationSaving = new Date().getTime() - this._nowStartSaving;
    this.setState({ alertStatus: -1, alertColor: 'danger', alertMessage: `Error while saving (error=${errorMessage}, duration=${durationSaving}ms)` });
  }

  onSnapshotStartProcessing = () => {
    this._nowStartProcessing = new Date().getTime();
    this.setState({ alertStatus: 11, alertColor: 'info', alertMessage: 'Processing snapshot...' });
  }

  onSnapshotError = (errorMessage) => {
    const durationSaving = new Date().getTime() - this._nowStartProcessing;
    this.setState({ alertStatus: -11, alertColor: 'danger', alertMessage: `Error while processing snapshot (error=${errorMessage}, duration=${durationSaving}ms)` });
  }

  onSnapshotReady = () => {
    const nowUpdateCanvas = new Date().getTime();
    const timeDiffTotal = nowUpdateCanvas - this._nowStartProcessing;
    this.setState({ alertStatus: 12, alertColor: 'success', alertMessage: `Snapshot processed (duration=${timeDiffTotal}ms)` });
    setTimeout(() => { this.setState({ alertStatus: 0 }); }, 3000);

    // const timeDiff = nowUpdateCanvas - nowUpdateParent;
    // this._logOnDisplay.addLog(`AddItem() - time to display image = ${timeDiff}`);
    // this._logOnDisplay.addLog(`AddItem() - total time to process snapshot = ${timeDiffTotal}`);
  }



  onSubmit(data) {
    this.onStartSaving();

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
  }


  render() {
    return (
      <Container fluid>
        {this.state.alertStatus !== 0 && <Alert color={this.state.alertColor}>{this.state.alertMessage}</Alert>}
        <AddItemForm
          ref={(r) => { this._childComponent = r; }}
          kinds={this.props.kinds}
          categories={this.props.categories}
          items={this.props.items}
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
  // Add the All to the Kind & Category lists
  return {
    kinds: state.kinds.kinds,
    categories: state.categories.categories,
    items: state.items.items,
  };
};

AddItemContainer = connect(mapStateToProps)(AddItemContainer);
export default AddItemContainer;
