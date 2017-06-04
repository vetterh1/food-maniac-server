/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import SimpleListOrDropdown from '../utils/SimpleListOrDropdown';
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

      name: '',
      // Selected Kind & Category:
      // (also updated in componentWillReceiveProps when receiving lists)
      category: this.props.categories.length > 0 ? this.props.categories[0].id : '',
      kind: this.props.kinds.length > 0 ? this.props.kinds[0].id : '',
    };

    this.state = {
      // Empty marks, kind, categories & items:
      ...this.defaultState,
    };
    console.log('AddItemForm constructor (props, initial state): ', props, this.state);
  }


  componentWillReceiveProps(nextProps) {
    if (!nextProps) return;
    let needUpdate = false;
    const updState = {};

    // Kinds list update: select default category if not set yet!
    if (nextProps.categories && nextProps.categories.length > 0 && nextProps.categories !== this.props.categories) {
      if (!this.state.category || this.state.category === '') {
        updState.category = nextProps.categories[0].id;
        this.defaultState.category = updState.category;
        needUpdate = true;
        console.log('category updated:', updState.category);
      } else console.log('...NO update category! (2)');
    } else console.log('...NO update category!');

    // Kinds list update: select default kind if not set yet!
    if (nextProps.kinds && nextProps.kinds.length > 0 && nextProps.kinds !== this.props.kinds) {
      if (!this.state.kind || this.state.kind === '') {
        updState.kind = nextProps.kinds[0].id;
        this.defaultState.kind = updState.kind;
        needUpdate = true;
        console.log('kind updated:', updState.kind);
      } else console.log('...NO update kind! (2)');
    } else console.log('...NO update kind!');

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
    window.scrollTo(0, 0);
    this.refSubmit.blur();
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

          <Button type="submit" size="md" disabled={!formReadyForSubmit} getRef={(ref) => { this.refSubmit = ref; }} >Add</Button>
          <Button color="link" onClick={this.resetForm.bind(this)} size="md" getRef={(ref) => { this.refReset = ref; }}>Reset</Button>
        </Form>
      </div>
    );
  }

}

export default AddItemForm;


//        <LogOnDisplay ref={(r) => { this._logOnDisplay = r; }} />
