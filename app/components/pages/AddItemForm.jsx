/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import SelectItemPlus from '../utils/SelectItemPlus';
// import { AvForm, AvField, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
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

class AddItemForm extends React.Component {
  static propTypes = {
    kinds: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onSnapshotStartProcessing: PropTypes.func.isRequired,
    onSnapshotError: PropTypes.func.isRequired,
    onSnapshotReady: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.onSnapshotReady = this.onSnapshotReady.bind(this);
    this._imageCameraSnapshot = null;

    // this._logOnDisplay = null;

    this.defaultState = {
      // unique key for the form --> used for reset form
      keyForm: Date.now(),

      canSubmit: false,

      name: '',
      // Selected Kind & Category:
      // (also updated in componentWillReceiveProps when receiving lists)
      category: '',
      kind: '',
    };

    this.state = {
      ...this.defaultState,
    };
    console.log('AddItemForm constructor (props, initial state): ', props, this.state);
  }


  onDeleteSnapshot = () => {
    this._imageCameraSnapshot.src = '';
    this.setState({ picture: null });
  }

  onSnapshotReady = (data /* , nowUpdateParent */) => {
    this.displaySnapshot(data);
    console.log('AddItemForm.onSnapshot() snapshot length: ', data ? data.length : 'null');
    this.setState({ picture: data });

    // Call parent for user feedback (status)
    this.props.onSnapshotReady();
  }

  onSubmit(event) {
    event.preventDefault();

    const returnValue = {
      category: this.state.category,
      kind: this.state.kind,
      name: this.state.name,
      picture: this.state.picture,
    };
    window.scrollTo(0, 0);
    this.refSubmit.blur();
    this.props.onSubmit(returnValue);
  }

  onChangeKind(kind) {
    if (this.state.kind === kind) return;
    this.setState({ kind });
  }

  onChangeCategory(category) {
    if (this.state.category === category) return;
    this.setState({ category });
  }

  // TODO : Should verify on server side if name already exists
  // and at least not in items list
  onChangeName(event) {
    if (this.state.name === event.target.value) return;
    console.log('AddItemForm.onChangeName value:', event.target.value);
    this.setState({ name: event.target.value });
  }

  displaySnapshot = (data) => {
    this._imageCameraSnapshot.src = data;
  }


  resetForm() {
    // Reset the form & clear the image
    this.setState(Object.assign({},
      // Erase marks & reset kind, categories & items:
      this.defaultState,
    ));
    this._refSelectItemPlus.reset();
    this.refReset.blur();
    window.scrollTo(0, 0);
  }


  render() {
    console.log('AddItemForm render: (category, kind, name, picture)=', this.state.category, this.state.kind, this.state.name, this.state.picture ? this.state.picture.length : 'null');
    const formReadyForSubmit = this.state.name && this.state.kind && this.state.category;
    return (
      <div style={styles.form}>

        <h3 className="mb-4">Add new dish...</h3>
        <Form onSubmit={this.onSubmit.bind(this)} >
          <SelectItemPlus
            hideItem
            kinds={this.props.kinds}
            categories={this.props.categories}
            onChangeKind={this.onChangeKind.bind(this)}
            onChangeCategory={this.onChangeCategory.bind(this)}
            kindPlaceHolder="Select a kind"
            categoryPlaceHolder="Select a category"
            ref={(r) => { this._refSelectItemPlus = r; }} // used to reset the 3 dropdowns
          />

          <FormGroup row>
            <Col xs={12} sm={2} >
              <Label for="inputName" size="md">Name</Label>
            </Col>
            <Col xs={12} sm={10} >
              <Input name="name" id="inputName" onChange={this.onChangeName.bind(this)} value={this.state.name} placeholder="..." required size="md" />
              <FormFeedback>This field is mandatory!</FormFeedback>
            </Col>
          </FormGroup>

          <FormGroup row>
            <Col xs={12} sm={2} >
              <Label for="inputName" size="md">Picture</Label>
            </Col>
            <Col xs={12} sm={10} >
              <CameraSnapshotContainer onError={this.props.onSnapshotError} onSnapshotStartProcessing={this.props.onSnapshotStartProcessing} onSnapshotReady={this.onSnapshotReady.bind(this)} onDeleteSnapshot={this.onDeleteSnapshot.bind(this)} />
              <img ref={(r) => { this._imageCameraSnapshot = r; }} style={styles.imageCameraSnapshot} alt="" />
            </Col>
          </FormGroup>

          <FormGroup row className="mt-4">
            <Button color="primary" type="submit" size="md" disabled={!formReadyForSubmit} getRef={(ref) => { this.refSubmit = ref; }} >Add</Button>
            <Button color="link" onClick={this.resetForm.bind(this)} size="md" getRef={(ref) => { this.refReset = ref; }}>Reset</Button>
          </FormGroup>
        </Form>
      </div>
    );
  }

}

export default AddItemForm;


//        <LogOnDisplay ref={(r) => { this._logOnDisplay = r; }} />
