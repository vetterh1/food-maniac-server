/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import SimpleListOrDropdown from '../pages/SimpleListOrDropdown';
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
    items: PropTypes.array.isRequired,
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

      // Selected Kind & Category:
      name: '',
      category: 'dish',
      kind: 'other',
    };

    this.state = {
      // Items received from redux-store
      // and stored in state as it's altered by kind & category filters
      items: props.items,

      // Empty marks, kind, categories & items:
      ...this.defaultState,
    };
    console.log('AddItemForm constructor (props, initial state): ', props, this.state);
  }


  componentWillReceiveProps(nextProps) {
    if (!nextProps) return;
    let needUpdate = false;
    const updState = {};

    console.log('componentWillReceiveProps items (length & 1st) crt --> : ',
     !this.state.items || this.state.items.length <= 0 ? 'null or empty' : this.state.items.length, this.state.items[0]);

    console.log('componentWillReceiveProps items (length & 1st) --> next: ',
     !nextProps.items || nextProps.items.length <= 0 ? 'null or empty' : nextProps.items.length, nextProps.items[0]);

    // Items list copy from redux --> state as the items list changes (with kind & category filters)
    if (nextProps.items && nextProps.items.length > 0 && nextProps.items !== this.state.items) {
      console.log('...update items!');
      updState.items = nextProps.items;
      needUpdate = true;
    } else console.log('...NO update items!');

    // Launch the state update
    if (needUpdate) { this.setState(updState); }
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
    this.props.onSubmit(returnValue);
  }

  onChangeKind(event) {
    if (this.state.kind === event.target.value) return;
    this.setState({ kind: event.target.value });
  }

  onChangeCategory(event) {
    if (this.state.category === event.target.value) return;
    this.setState({ category: event.target.value });
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
  }


  render() {
    console.log('render: (category, kind, name, picture)=', this.state.category, this.state.kind, this.state.name, this.state.picture ? this.state.picture.length : 'null');
    const formReadyForSubmit = this.state.name && this.state.kind && this.state.category;
    return (
      <div style={styles.form}>

        <h3 className="mb-4">Add new dish...</h3>
        <Form onSubmit={this.onSubmit.bind(this)} >
          <FormGroup>
            <Label size="md">Category</Label>
            <SimpleListOrDropdown items={this.props.categories} selectedOption={this.state.category} onChange={this.onChangeCategory.bind(this)} dropdown />
            <Label size="md">Kind</Label>
            <SimpleListOrDropdown items={this.props.kinds} selectedOption={this.state.kind} onChange={this.onChangeKind.bind(this)} dropdown />
          </FormGroup>

          <FormGroup>
            <Label for="inputName" size="md">Name</Label>
            <Input name="name" id="inputName" onChange={this.onChangeName.bind(this)} value={this.state.name} placeholder="..." required size="md" />
            <FormFeedback>This field is mandatory!</FormFeedback>
          </FormGroup>

          <div>
            <Label size="md">Picture</Label>
            <CameraSnapshotContainer onError={this.props.onSnapshotError} onSnapshotStartProcessing={this.props.onSnapshotStartProcessing} onSnapshotReady={this.onSnapshotReady.bind(this)} onDeleteSnapshot={this.onDeleteSnapshot.bind(this)} />
            <img ref={(r) => { this._imageCameraSnapshot = r; }} style={styles.imageCameraSnapshot} alt="" />
          </div>

          <Button type="submit" size="md" disabled={!formReadyForSubmit}>Add</Button>
          <Button color="link" onClick={this.resetForm.bind(this)} size="md">Reset</Button>
        </Form>
      </div>
    );
  }

}

export default AddItemForm;


//        <LogOnDisplay ref={(r) => { this._logOnDisplay = r; }} />
