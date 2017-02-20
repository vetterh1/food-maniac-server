import React from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'react-bootstrap';

import CameraSnapshotContainer from './CameraSnapshotContainer';
import LogOnDisplay from '../utils/LogOnDisplay';

const styles = {
  paperStyle: {
    // width: 300,
    // margin: '20 auto',
    padding: 20,
  },
  submitStyle: {
    marginTop: 32,
  },
  form_content: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  form_buttons: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  item: {
    padding: '0.5em',
    marginRight: 32,
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
    this.enableButton = this.enableButton.bind(this);
    this.disableButton = this.disableButton.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.notifyFormError = this.notifyFormError.bind(this);
    this.categoryChange = this.categoryChange.bind(this);
    this.kindChange = this.kindChange.bind(this);
    this.nameChange = this.nameChange.bind(this);

    this.onSnapshotStartProcessing = this.onSnapshotStartProcessing.bind(this);
    this.onSnapshotReady = this.onSnapshotReady.bind(this);
    this._imageCameraSnapshot = null;

    this._logOnDisplay = null;

    this.state = {
      canSubmit: false,
      messageType: null,
      messageText: null,
      name: '',
      picture: null,
      category: '',
      kind: '',
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

  categoryChange(event, value) { this.setState({ category: value }); }
  kindChange(event, value) { this.setState({ kind: value }); }

  enableButton() { this.setState({ canSubmit: true }); }
  disableButton() { this.setState({ canSubmit: false }); }

  submitForm(data) {
    // Add picture to data
    console.log('submitForm - state:', this.state);
    const dataWithPicture = Object.assign({}, this.state, { picture: this.state.picture });
    this.setState(
      { messageType: 'info', messageText: 'Sending...' },
      this.props.onSubmit(dataWithPicture) // callback fn: send data back to container
    );
  }

  notifyFormError(data) {
    console.error('Form error:', data);
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
    return (
      <div style={styles.paperStyle}>
        <h1>New dish...</h1>
        <Form
          // onValid={this.enableButton}
          // onInvalid={this.disableButton}
          onSubmit={this.submitForm}
          // onInvalidSubmit={this.notifyFormError}
        >
          <FormGroup>
            <Label for="selectCategory" size="lg">Category</Label>
            <Input type="select" name="category" id="selectCategory" size="lg">
              <option value={'dish'}>Dish</option>
              <option value={'dessert'}>Dessert</option>
              <option value={'drink'}>Drink</option>
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="selectKind" size="lg">Kind</Label>
            <Input type="select" name="kind" id="selectKind" size="lg">
              <option value={'italian'}>Italian</option>
              <option value={'french'}>French</option>
              <option value={'mexican'}>Mexican</option>
              <option value={'indian'}>Indian</option>
              <option value={'american'}>American</option>
              <option value={'other'}>Other</option>
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="inputName">Name</Label>
            <Input name="name" id="inputName" placeholder="..." />
          </FormGroup>

          <div>
            <h4>Picture</h4>
            <CameraSnapshotContainer onSnapshotStartProcessing={this.onSnapshotStartProcessing} onSnapshotReady={this.onSnapshotReady} onDeleteSnapshot={this.onDeleteSnapshot} />
          </div>

          <Button type="submit">Add</Button>
        </Form>
        <img ref={(r) => { this._imageCameraSnapshot = r; }} style={styles.imageCameraSnapshot} role="presentation" />
        <LogOnDisplay ref={(r) => { this._logOnDisplay = r; }} />
      </div>
    );
  }

}

export default AddItem;

//            bodyStyle={{ height: 'auto', lineHeight: '28px', padding: 24, whiteSpace: 'pre-line' }}
/*
          <Snackbar
            open={this.state.snackbarOpen}
            message={this.state.snackbarMessage}
            autoHideDuration={this.state.snackbarTimeout}
          />
 */