/* eslint-disable react/forbid-prop-types */

import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const logSimulateLocationModal = log.getLogger('loggerSimulateLocationModal');
logSimulateLocationModal.setLevel('debug');
logSimulateLocationModal.debug('--> entering SimulateLocationModal.jsx');


const styles = {
  form: {
    // width: 300,
    // margin: '20 auto',
    // padding: 20,
  },
  container: {
    margin: '0px',
    padding: '0px',
  },
  map: {
    height: '400px',
    // width: '300px',
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

    this._mapSimulated = null;
    this._mapGoogle = null;
    this._marker = null;

    this.defaultState = {
      // unique key for the form --> used for reset form
      keyForm: Date.now(),

      coordinates: props.coordinates,
      canSubmit: false,
    };

    this.state = {
      ...this.defaultState,
    };
    console.log('SimulateLocationModal constructor (props, initial state): ', props, this.state);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.props.open) return;

    logSimulateLocationModal.debug('{   SimulateLocationModal.componentDidUpdate (slm-cdm)');

    logSimulateLocationModal.debug('     slm-cdm - mapSimulated: ', this._mapSimulated);
    logSimulateLocationModal.debug('     slm-cdm - _mapGoogle: ', this._mapGoogle);

    if (!this._mapSimulated) {
      logSimulateLocationModal.debug('}   SimulateLocationModal.componentDidUpdate: no map element yet!');
      return;
    }

    if (this._mapGoogle) {
      logSimulateLocationModal.debug('     slm-cdm: _mapGoogle already defined...');
      if (prevProps.open === false && this.props.open === true) {
        logSimulateLocationModal.debug('     slm-cdm: ...but modal just opened... continue!');
      } else {
        logSimulateLocationModal.debug('     slm-cdm: ...and modal NOT just opened... stop!');
        return;
      }
    }

    // const nbRenders = this.state.nbRenders + 1;
    const currentLatLng = new google.maps.LatLng(this.props.coordinates.latitude, this.props.coordinates.longitude);
    logSimulateLocationModal.debug('       (slm-cdm) currentLatLng : ', currentLatLng);

    this._mapGoogle = new google.maps.Map(this._mapSimulated, {
      center: currentLatLng,
      zoom: 15,
    });
    this._mapGoogle.addListener('center_changed', () => { this.setPosition(this._mapGoogle.getCenter()); });
    this._mapGoogle.addListener('click', (event) => { this.setPosition(event.latLng); });

    this._marker = new google.maps.Marker({
      position: currentLatLng,
      map: this._mapGoogle,
      title: 'Move to wished area',
    });

    logSimulateLocationModal.debug('       (slm-cdm) this._mapGoogle : ', this._mapGoogle);
    logSimulateLocationModal.debug('}   SimulateLocationModal.componentDidUpdate');
  }




  onSubmit() {
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


  setPosition(coordinates) {  // coordinates are a LatLng object!
      this._marker.setPosition(coordinates);
      this.setState({ coordinates: { latitude: coordinates.lat(), longitude: coordinates.lng() } });
  }

  render() {
    if (!this.props.open) return null;

    logSimulateLocationModal.debug('SimulateLocationModal render: (coordinates)=', JSON.stringify(this.state.coordinates));
    const formReadyForSubmit = this.state.coordinates.latitude !== 0 && this.state.coordinates.longitude !== 0;
    return (
      <Modal isOpen={this.props.open} toggle={this.onCancel.bind(this)}>
        <ModalHeader toggle={this.onCancel.bind(this)}>Select a location...</ModalHeader>
        <ModalBody>
          <Container fluid style={styles.container}>
            <div ref={(r) => { this._mapSimulated = r; }} style={styles.map} />
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

/*

  // clickSimulatedLasVegas = () => {
  //   this.setState({ coordinates: { latitude: 36.0839998, longitude: -115.1559276 } });
  // };

            <Alert color="warning">....</Alert>
            <Button onClick={this.clickSimulatedLasVegas}>LasVegas (simulated)</Button>
*/

//        <LogOnDisplay ref={(r) => { this._logOnDisplay = r; }} />
