import React from 'react';
import { Button, Label, FormGroup, Alert } from 'reactstrap';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import CameraSnapshotContainer from './CameraSnapshotContainer';
// import LogOnDisplay from '../utils/LogOnDisplay';

const styles = {
  form: {
    // width: 300,
    // margin: '20 auto',
    padding: 20,
  },
  imageCameraSnapshot: {
    maxWidth: 300,
    maxHeight: 200,
  },
};

class AddItem extends React.Component {
  static propTypes = {
    onSubmit: React.PropTypes.func.isRequired,
  }

  constructor() {
    super();
    this.submitForm = this.submitForm.bind(this);
    this.resetForm = this.resetForm.bind(this);

    this.onSnapshotStartProcessing = this.onSnapshotStartProcessing.bind(this);
    this.onSnapshotError = this.onSnapshotError.bind(this);
    this.onSnapshotReady = this.onSnapshotReady.bind(this);
    this._imageCameraSnapshot = null;

    // this._logOnDisplay = null;

    this.state = {
      canSubmit: false,
      // alertStatus possible values:
      // -  0: no alerts
      //  - saving alerts:  1: saving, 2: saving OK, -1: saving KO
      //  - snapshot alerts: 11: snapshot processing, 12: snapshot OK, -11: snapshot KO
      alertStatus: 0,
      alertMessage: '',
      keyForm: Date.now(),
    };
  }

  onStartSaving() {
    this._nowStartSaving = new Date().getTime();
    this.setState({ alertStatus: 1, alertColor: 'info', alertMessage: 'Saving item...' });
    window.scrollTo(0, 0);
  }

  onEndSavingOK() {
    const durationSaving = new Date().getTime() - this._nowStartSaving;
    this.setState({ alertStatus: 2, alertColor: 'success', alertMessage: `Item saved! (duration=${durationSaving}ms)` });
    setTimeout(() => { this.setState({ alertStatus: 0 }); }, 3000);
    this.resetForm();
  }

  onEndSavingFailed(errorMessage) {
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

  onDeleteSnapshot = () => {
    this._imageCameraSnapshot.src = '';
    this.setState({ picture: null });
  }

  onSnapshotReady = (data /* , nowUpdateParent */) => {
    this.displaySnapshot(data);
    console.log('AddItem.onSnapshot() snapshot length: ', data ? data.length : 'null');
    this.setState({ picture: data });

    const nowUpdateCanvas = new Date().getTime();
    const timeDiffTotal = nowUpdateCanvas - this._nowStartProcessing;
    this.setState({ alertStatus: 12, alertColor: 'success', alertMessage: `Snapshot processed (duration=${timeDiffTotal}ms)` });
    setTimeout(() => { this.setState({ alertStatus: 0 }); }, 3000);

    // const timeDiff = nowUpdateCanvas - nowUpdateParent;
    // this._logOnDisplay.addLog(`AddItem() - time to display image = ${timeDiff}`);
    // this._logOnDisplay.addLog(`AddItem() - total time to process snapshot = ${timeDiffTotal}`);
  }

  submitForm(event, values) {
    // console.log('submitForm - state:', this.state);

    // Add picture to data
    const dataWithPicture = Object.assign({}, values, { picture: this.state.picture });
    this.setState({ values }, this.props.onSubmit(dataWithPicture)); // callback fn: send data back to container
  }

  displaySnapshot = (data) => {
    this._imageCameraSnapshot.src = data;
  }

  nameChange(event, value) {
    this.setState({ name: value });
    console.log('AddItem.nameChange value:', value);
    // TODO : Should verify on server side if name already exists
  }

  resetForm() {
    // Reset the form & clear the image
    this.setState({ keyForm: Date.now() });
  }


  render() {
    const defaultValues = {
      name: '',
      category: 'dish',
      kind: 'other',
    };

    return (
      <div style={styles.form}>

        {this.state.alertStatus !== 0 && <Alert color={this.state.alertColor}>{this.state.alertMessage}</Alert>}

        <h1>Add new dish...</h1>
        <AvForm
          key={this.state.keyForm}  // unique key that let reset the form by changing the state keyForm
          // onValid={this.enableButton}
          // onInvalid={this.disableButton}
          onValidSubmit={this.submitForm}
          // onInvalidSubmit={this.notifyFormError}
          model={defaultValues}
        >
          <FormGroup>
            <AvField type="select" name="category" label="Category" size="lg">
              <option value={'dish'}>Dish</option>
              <option value={'dessert'}>Dessert</option>
              <option value={'drink'}>Drink</option>
            </AvField>
          </FormGroup>

          <FormGroup>
            <AvField type="select" name="kind" label="Kind" size="lg">
              <option value={'italian'}>Italian</option>
              <option value={'french'}>French</option>
              <option value={'mexican'}>Mexican</option>
              <option value={'indian'}>Indian</option>
              <option value={'american'}>American</option>
              <option value={'other'}>Other</option>
            </AvField>
          </FormGroup>

          <AvGroup>
            <Label for="inputName" size="lg">Name</Label>
            <AvInput name="name" id="inputName" placeholder="..." required size="lg" />
            <AvFeedback>This field is mandatory!</AvFeedback>
          </AvGroup>

          <div>
            <Label size="lg">Picture</Label>
            <CameraSnapshotContainer onError={this.onSnapshotError} onSnapshotStartProcessing={this.onSnapshotStartProcessing} onSnapshotReady={this.onSnapshotReady} onDeleteSnapshot={this.onDeleteSnapshot} />
            <img ref={(r) => { this._imageCameraSnapshot = r; }} style={styles.imageCameraSnapshot} role="presentation" />
          </div>

          <Button type="submit" size="lg">Add</Button>
          <Button color="link" onClick={this.resetForm} size="lg">Reset</Button>
        </AvForm>
      </div>
    );
  }

}

export default AddItem;


//        <LogOnDisplay ref={(r) => { this._logOnDisplay = r; }} />
