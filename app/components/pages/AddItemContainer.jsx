import React from 'react';
import { Alert } from 'reactstrap';
import AddItem from './AddItem';

require('es6-promise').polyfill();
require('isomorphic-fetch');

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
    this._addItemComponent = null;

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
    this.setState({ alertStatus: 1, alertColor: 'info', alertMessage: 'Saving item...' });
    window.scrollTo(0, 0);
  }

  onEndSavingOK = () => {
    const durationSaving = new Date().getTime() - this._nowStartSaving;
    this.setState({ alertStatus: 2, alertColor: 'success', alertMessage: `Item saved! (duration=${durationSaving}ms)` });
    setTimeout(() => { this.setState({ alertStatus: 0 }); }, 3000);

    // Tell the form to reset
    if (this._addItemComponent) this._addItemComponent.resetForm();
  }

  onEndSavingFailed = (errorMessage) => {
    const durationSaving = new Date().getTime() - this._nowStartSaving;
    this.setState({ alertStatus: -1, alertColor: 'danger', alertMessage: `Error while saving item (error=${errorMessage}, duration=${durationSaving}ms)` });
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
      console.log('fetch result: ', response);
      if (response.ok) {
        this.onEndSavingOK();
        console.log('fetch operation OK');
        return response.blob();
      }
      this.onEndSavingFailed('01');
      throw new Error('Network response was not ok.');
    })
    .catch((error) => {
      this.onEndSavingFailed('02');
      console.error(`There has been a problem with your fetch operation: ${error.message}`);
    });
    console.log('AddItemContainer.submitForm - 2');
  }


  render() {
    return (
      <div>
        {this.state.alertStatus !== 0 && <Alert color={this.state.alertColor}>{this.state.alertMessage}</Alert>}
        <AddItem ref={(r) => { this._addItemComponent = r; }} onSubmit={this.submitForm} onSnapshotStartProcessing={this.onSnapshotStartProcessing} onSnapshotError={this.onSnapshotError} onSnapshotReady={this.onSnapshotReady} />
      </div>
    );
  }

}

export default AddItemContainer;
