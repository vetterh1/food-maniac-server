/* eslint-disable react/forbid-prop-types */

import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, Container, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const logSimulateLocationModal = log.getLogger('loggerSimulateLocationModal');
logSimulateLocationModal.setLevel('debug');
logSimulateLocationModal.debug('--> entering SimulateLocationModal.jsx');


const styles = {
  test: {

  },
  modal: {
    // margin: '0px',
    // minWidth: '100%',
    // maxWidth: '100%',
  },
  modalbody: {
    // display: 'flex',
    // margin: 0,
    // padding: '0px',
  },
  container: {
    // margin: '0px',
    // position: 'relative',
    // width: '100%',
    // height: '100% ',
    display: 'flex',
    flex: '1 1 auto',
    padding: '0px',
  },
  btnGo: {
    // marginLeft: 'auto',
  },
  map: {
    // height: '100px',
    width: '100%',
    minHeight: '150px',
    // width: '300px',
  },
};

class SimulateLocationModal extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    coordinates: PropTypes.shape({
      error: PropTypes.number,
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      simulated: PropTypes.boolean,
      real: PropTypes.boolean,
      changed: PropTypes.boolean,
      changedReal: PropTypes.boolean,
      nbRefreshes: PropTypes.number,
      nbDiffs: PropTypes.number,
      nbReal: PropTypes.number,
      nbEstimated: PropTypes.number,
      nbClose: PropTypes.number,
      latitude_save: PropTypes.number,
      longitude_save: PropTypes.number,
    }).isRequired,
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
      streetViewControl: false,
      mapTypeControl: false,
      gestureHandling: 'greedy',
    });
    this._mapGoogle.addListener('center_changed', () => { this.setPosition(this._mapGoogle.getCenter()); });
    this._mapGoogle.addListener('click', (event) => { this.setPosition(event.latLng); });

    const titleLabel = this.context.intl.formatMessage({ id: 'location.move.long' });

    this._marker = new google.maps.Marker({
      position: currentLatLng,
      map: this._mapGoogle,
      title: titleLabel,
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
      <div style={styles.test}>
        <Modal id="simlocmod" className="sim-loc-mod" style={styles.modal} isOpen={this.props.open} toggle={this.onCancel.bind(this)}>
          <ModalHeader toggle={this.onCancel.bind(this)}>
            <FormattedMessage id="location.select.long" />...
          </ModalHeader>
          <ModalBody style={styles.modalbody}>
            <Container fluid style={styles.container}>
              <div ref={(r) => { this._mapSimulated = r; }} style={styles.map} />
            </Container>
          </ModalBody>
          <ModalFooter>
            <Button style={styles.btnGo} color="primary" type="submit" onClick={this.onSubmit.bind(this)} size="md" disabled={!formReadyForSubmit} getRef={(ref) => { this.refSubmit = ref; }} ><FormattedMessage id="core.go" /></Button>
            <Button color="link" onClick={this.onCancel.bind(this)} size="md"><FormattedMessage id="core.cancel" /></Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }

}

SimulateLocationModal.contextTypes = { intl: PropTypes.object.isRequired };

export default SimulateLocationModal;

/*
            <div>Move to desired place & press Go</div>

  // clickSimulatedLasVegas = () => {
  //   this.setState({ coordinates: { latitude: 36.0839998, longitude: -115.1559276 } });
  // };

            <Alert color="warning">....</Alert>
            <Button onClick={this.clickSimulatedLasVegas}>LasVegas (simulated)</Button>
*/

//        <LogOnDisplay ref={(r) => { this._logOnDisplay = r; }} />
