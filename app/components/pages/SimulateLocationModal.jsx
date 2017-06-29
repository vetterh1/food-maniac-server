/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, Container, Col, FormFeedback, FormGroup, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const styles = {
  form: {
    // width: 300,
    // margin: '20 auto',
    // padding: 20,
  },
};

class SimulateLocationModal extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    coordinates: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.defaultState = {
      // unique key for the form --> used for reset form
      keyForm: Date.now(),

      coordinates: { latitude: 0, longitude: 0 },
      canSubmit: false,
    };

    this.state = {
      ...this.defaultState,
    };
    console.log('SimulateLocationModal constructor (props, initial state): ', props, this.state);
  }



  onSubmit(event) {
    // event.preventDefault();

    const returnValue = {
      coordinates: this.state.coordinates,
    };
    this.props.onSubmit(returnValue);

    // Reset for next time it's displayed
    this.setState(this.defaultState);
  }

  onCancel() {
    // Reset for next time it's displayed
    this.setState(this.defaultState);

    this.props.onCancel();
  }

  clickSimulatedLasVegas = (e) => {
    this.setState({ coordinates: { latitude: 36.0839998, longitude: -115.1559276 } });
  };

  render() {
    console.log('SimulateLocationModal render: (coordinates)=', JSON.stringify(this.state.coordinates));
    const formReadyForSubmit = this.state.coordinates.latitude != 0 && this.state.coordinates.longitude != 0
    return (
      <Modal isOpen={this.props.open} toggle={this.onCancel.bind(this)}>
        <ModalHeader toggle={this.onCancel.bind(this)}>Select a location...</ModalHeader>
        <ModalBody>
          <Container fluid>
            <Alert color="warning">....</Alert>
            <Button onClick={this.clickSimulatedLasVegas}>LasVegas (simulated)</Button>
          </Container>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" type="submit" onClick={this.onSubmit.bind(this)} size="md" disabled={!formReadyForSubmit} getRef={(ref) => { this.refSubmit = ref; }} >Go!</Button>
          <Button color="link" onClick={this.onCancel.bind(this)} size="md">Cancel</Button>
        </ModalFooter>
      </Modal>
    );
  }

}

export default SimulateLocationModal;


//        <LogOnDisplay ref={(r) => { this._logOnDisplay = r; }} />
