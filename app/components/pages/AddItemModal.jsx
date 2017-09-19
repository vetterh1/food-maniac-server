// TODO: i18n
/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, Container, Col, FormFeedback, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter, Row } from 'reactstrap';
import SelectItemPlus from '../utils/SelectItemPlus';
// import { AvForm, AvField, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import CameraSnapshotContainer from './CameraSnapshotContainer';
// import LogOnDisplay from '../utils/LogOnDisplay';

const styles = {
  form: {
    // width: 300,
    // margin: '20 auto',
    // padding: 20,
  },
  imageCameraSnapshot: {
    maxWidth: 300,
    maxHeight: 200,
  },
};

class AddItemModal extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    kinds: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
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
    console.log('AddItemModal constructor (props, initial state): ', props, this.state);
  }


  onDeleteSnapshot = () => {
    this._imageCameraSnapshot.src = '';
    this.setState({ picture: null });
  }

  onSnapshotReady = (data /* , nowUpdateParent */) => {
    this.displaySnapshot(data);
    console.log('AddItemModal.onSnapshot() snapshot length: ', data ? data.length : 'null');
    this.setState({ picture: data });

    // Call parent for user feedback (status)
    this.props.onSnapshotReady();
  }

  onSubmit(event) {
    // event.preventDefault();

    const returnValue = {
      category: this.state.category,
      kind: this.state.kind,
      name: this.state.name,
      picture: this.state.picture,
    };
    this.props.onSubmit(returnValue);

    // Reset for next time it's displayed
    this.setState(this.defaultState);
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
    console.log('AddItemModal.onChangeName value:', event.target.value);
    this.setState({ name: event.target.value });
  }

  displaySnapshot = (data) => {
    this._imageCameraSnapshot.src = data;
  }


  onCancel() {
    // Reset for next time it's displayed
    this.setState(this.defaultState);

    this.props.onCancel();
  }


  render() {
    if (!this.props.open) return null;
    
    console.log('AddItemModal render: (category, kind, name, picture)=', this.state.category, this.state.kind, this.state.name, this.state.picture ? this.state.picture.length : 'null');
    const formReadyForSubmit = this.state.name && this.state.kind && this.state.category;
    return (
      <Modal className="bottom-space-for-help" size="lg" isOpen={this.props.open} toggle={this.onCancel.bind(this)}>
        <ModalHeader toggle={this.onCancel.bind(this)}>Add new dish...</ModalHeader>
        <ModalBody>
          <Container fluid>
            <Alert color="warning">Please make sure a similar item does not already exist!</Alert>
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

            <Row>
              <Col xs={12} sm={3} md={2} >
                <Label for="inputName" size="md">Name</Label>
              </Col>
              <Col xs={12} sm={9} md={10} >
                <Input name="name" id="inputName" onChange={this.onChangeName.bind(this)} value={this.state.name} placeholder="..." required size="md" />
                <FormFeedback>This field is mandatory!</FormFeedback>
              </Col>
            </Row>

            <Row>
              <Col xs={12} sm={3} md={2} >
                <Label for="inputName" size="md">Picture</Label>
              </Col>
              <Col xs={12} sm={9} md={10} >
                <CameraSnapshotContainer onError={this.props.onSnapshotError} onSnapshotStartProcessing={this.props.onSnapshotStartProcessing} onSnapshotReady={this.onSnapshotReady.bind(this)} onDeleteSnapshot={this.onDeleteSnapshot.bind(this)} />
                <img ref={(r) => { this._imageCameraSnapshot = r; }} style={styles.imageCameraSnapshot} alt="" />
              </Col>
            </Row>
          </Container>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" type="submit" onClick={this.onSubmit.bind(this)} size="md" disabled={!formReadyForSubmit} getRef={(ref) => { this.refSubmit = ref; }} >Add</Button>
          <Button color="link" onClick={this.onCancel.bind(this)} size="md">Cancel</Button>
        </ModalFooter>
      </Modal>
    );
  }

}

export default AddItemModal;


//        <LogOnDisplay ref={(r) => { this._logOnDisplay = r; }} />
