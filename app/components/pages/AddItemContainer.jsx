import * as log from 'loglevel';
import React from 'react';
import { Alert } from 'reactstrap';
import AddItem from './AddItem';

require('es6-promise').polyfill();
require('isomorphic-fetch');

const logAddItemContainer = log.getLogger('logAddItemContainer');
logAddItemContainer.setLevel('debug');
logAddItemContainer.warn('--> entering AddItemContainer.jsx');

class AddItemContainer extends React.Component {
  static propTypes = {
  }

  constructor() {
    super();

    this.onStartSaving = this.onStartSaving.bind(this);
    this.onEndSavingOK = this.onEndSavingOK.bind(this);
    this.onEndSavingFailed = this.onEndSavingFailed.bind(this);
    this.onSnapshotStartProcessing = this.onSnapshotStartProcessing.bind(this);
    this.onSnapshotError = this.onSnapshotError.bind(this);
    this.onSnapshotReady = this.onSnapshotReady.bind(this);
    this.submitForm = this.submitForm.bind(this);
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



  submitForm(data) {
    this.onStartSaving();

    console.log('AddItemContainer.submitForm - 1', data);
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
      <div>
        {this.state.alertStatus !== 0 && <Alert color={this.state.alertColor}>{this.state.alertMessage}</Alert>}
        <AddItem ref={(r) => { this._childComponent = r; }} onSubmit={this.submitForm} onSnapshotStartProcessing={this.onSnapshotStartProcessing} onSnapshotError={this.onSnapshotError} onSnapshotReady={this.onSnapshotReady} />
      </div>
    );
  }

}

export default AddItemContainer;
