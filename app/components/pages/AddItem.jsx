import React from 'react';
import PropTypes from 'prop-types';
import { Button, Label, FormGroup } from 'reactstrap';
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
    onSubmit: PropTypes.func.isRequired,
    onSnapshotStartProcessing: PropTypes.func.isRequired,
    onSnapshotError: PropTypes.func.isRequired,
    onSnapshotReady: PropTypes.func.isRequired,
  }

  constructor() {
    super();
    this.submitForm = this.submitForm.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.onSnapshotReady = this.onSnapshotReady.bind(this);
    this._imageCameraSnapshot = null;

    // this._logOnDisplay = null;

    this.state = {
      keyForm: Date.now(),  // unique key for the form --> used for reset form
      canSubmit: false,
    };
  }

  onDeleteSnapshot = () => {
    this._imageCameraSnapshot.src = '';
    this.setState({ picture: null });
  }

  onSnapshotReady = (data /* , nowUpdateParent */) => {
    this.displaySnapshot(data);
    console.log('AddItem.onSnapshot() snapshot length: ', data ? data.length : 'null');
    this.setState({ picture: data });

    // Call parent for user feedback (status)
    this.props.onSnapshotReady();
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

        <h2>Add new dish...</h2>
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
            <CameraSnapshotContainer onError={this.props.onSnapshotError} onSnapshotStartProcessing={this.props.onSnapshotStartProcessing} onSnapshotReady={this.onSnapshotReady} onDeleteSnapshot={this.onDeleteSnapshot} />
            <img ref={(r) => { this._imageCameraSnapshot = r; }} style={styles.imageCameraSnapshot} alt="" />
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
