import React from 'react';
import { Button, Label, FormGroup } from 'reactstrap';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import CameraSnapshotContainer from './CameraSnapshotContainer';
import LogOnDisplay from '../utils/LogOnDisplay';

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

    this.onSnapshotStartProcessing = this.onSnapshotStartProcessing.bind(this);
    this.onSnapshotReady = this.onSnapshotReady.bind(this);
    this._imageCameraSnapshot = null;

    this._logOnDisplay = null;

    this.state = {
      canSubmit: false,
      messageType: null,
      messageText: null,
      snackbarOpen: false,
      snackbarMessage: '.',
      snackbarTimeout: 4000,
    };
  }

  onStartSaving() {
    this._nowStartSaving = new Date().getTime();
    this.setState({ snackbarOpen: true, snackbarMessage: 'Saving...', snackbarTimeout: 60000 });
  }

  onEndSavingOK() {
    const durationSaving = new Date().getTime() - this._nowStartSaving;
    this.setState({ snackbarOpen: true, snackbarMessage: `Item saved! (duration=${durationSaving}ms)`, snackbarTimeout: 4000 });
  }

  onEndSavingFailed(errorMessage) {
    const durationSaving = new Date().getTime() - this._nowStartSaving;
    this.setState({ snackbarOpen: true, snackbarMessage: `Error while saving item (error=${errorMessage}, duration=${durationSaving}ms)`, snackbarTimeout: 10000 });
  }

  onSnapshotStartProcessing = () => {
    this._nowStartProcessing = new Date().getTime();
    this.setState({ snackbarOpen: true, snackbarMessage: 'Processing snapshot...', snackbarTimeout: 2000 });
  }

  onDeleteSnapshot = () => {
    this._imageCameraSnapshot.src = '';
    this.setState({ picture: null });
  }

  onSnapshotReady = (data, nowUpdateParent) => {
    this.displaySnapshot(data);
    console.log('AddItem.onSnapshot() snapshot length: ', data ? data.length : 'null');
    this.setState({ picture: data });

    const nowUpdateCanvas = new Date().getTime();
    const timeDiff = nowUpdateCanvas - nowUpdateParent;
    this._logOnDisplay.addLog(`AddItem() - time to display image = ${timeDiff}`);
    const timeDiffTotal = nowUpdateCanvas - this._nowStartProcessing;
    this._logOnDisplay.addLog(`AddItem() - total time to process snapshot = ${timeDiffTotal}`);

    // this.setState({ openSnackbarProcessingPicture: false });
  }

  submitForm(event, values) {
    // Add picture to data
    console.log('submitForm - state:', this.state);
    const dataWithPicture = Object.assign({}, values, { picture: this.state.picture });
    this.setState(
      { values, messageType: 'info', messageText: 'Sending...' },
      this.props.onSubmit(dataWithPicture) // callback fn: send data back to container
    );
  }

  displaySnapshot = (data) => {
    this._imageCameraSnapshot.src = data;
  }

  nameChange(event, value) {
    this.setState({ name: value });
    console.log('AddItem.nameChange value:', value);
    // TODO : Should verify on server side if name already exists
  }


  render() {
    const defaultValues = {
      name: '',
      category: 'dish',
      kind: 'other',
    };

    return (
      <div style={styles.form}>
        <h1>Add new dish...</h1>
        <AvForm
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
            <CameraSnapshotContainer onSnapshotStartProcessing={this.onSnapshotStartProcessing} onSnapshotReady={this.onSnapshotReady} onDeleteSnapshot={this.onDeleteSnapshot} />
          </div>

          <Button type="submit" size="lg">Add</Button>
        </AvForm>

        <img ref={(r) => { this._imageCameraSnapshot = r; }} style={styles.imageCameraSnapshot} role="presentation" />
        <LogOnDisplay ref={(r) => { this._logOnDisplay = r; }} />
      </div>
    );
  }

}

export default AddItem;