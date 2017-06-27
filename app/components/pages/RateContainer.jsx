/* eslint-disable no-class-assign */
/* eslint-disable react/forbid-prop-types */

import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';
import Alert from 'react-s-alert';
import RateForm from './RateForm';
import AddItemContainer from '../pages/AddItemContainer';
import SimulateLocationContainer from '../pages/SimulateLocationContainer';
import stringifyOnce from '../../utils/stringifyOnce';
import { loglevelServerSend } from '../../utils/loglevel-serverSend';

require('es6-promise').polyfill();
require('isomorphic-fetch');

const logRateContainer = log.getLogger('logRateContainer');
loglevelServerSend(logRateContainer); // a setLevel() MUST be run AFTER this!
logRateContainer.setLevel('debug');
logRateContainer.debug('--> entering RateContainer.jsx');

class RateContainer extends React.Component {
  static propTypes = {
    // Injected by redux-store connect:
    kinds: PropTypes.object.isRequired,
    categories: PropTypes.object.isRequired,
    items: PropTypes.object.isRequired,
    places: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.values = null;

    this._childComponent = null;

    this.alert = null;

    this.state = {
      modalAddItemOpened: false,
      modalSimulateLocation: false,
    };
  }




  onStartSaving = () => {
    this._nowStartSaving = new Date().getTime();
    this.alert = Alert.info('Saving...');
  }

  onEndSavingOK = () => {
    const durationSaving = new Date().getTime() - this._nowStartSaving;
    this.alert = Alert.success(`Saved! (duration=${durationSaving}ms)`);

    // Tell the child to reset
    // CAUTION! only works because the form is the immediate child
    // ...because it does NOT use redux not redux-form
    // if this CHANGES, this should be replaced by a dispatch or a reset action
    // ex: dispatch(reset('AddItemForm'));
    if (this._childComponent) this._childComponent.resetForm();
  }

  onEndSavingFailed = (errorMessage) => {
    const durationSaving = new Date().getTime() - this._nowStartSaving;
    this.alert = Alert.error(`Error while saving (error=${errorMessage}, duration=${durationSaving}ms)`);
  }

  onSubmit(values) {
    this.onStartSaving();
    this.values = values;
    this.save();
  }

  onRequestAddItem() {
    this.setState({ modalAddItemOpened: true });
  }

  onCloseModalAddItem() {
    this.setState({ modalAddItemOpened: false });
  }

  onRequestSimulateLocation() {
    this.setState({ modalSimulateLocation: true });
  }

  onCloseModalSimulateLocation() {
    this.setState({ modalSimulateLocation: false });
  }


  save() {
    logRateContainer.debug(`RateContainer.save - values:\n\n${stringifyOnce(this.values, null, 2)}`);
    this.saveLocation()
    .then(this.saveMarks.bind(this))
    .then(this.saveDone.bind(this))
    .catch((error) => {
      logRateContainer.error('RateContainer.save failed: ', error);
      this.onEndSavingFailed('01');
    });
  }

  saveLocation() {
    // Return a new promise.
    return new Promise((resolve, reject) => {
      logRateContainer.debug('{ RateContainer.saveLocation');
      // logRateContainer.debug(`RateContainer.saveLocation - this.props:\n\n${stringifyOnce(this.props, null, 2)}`);

      const placeSelected = this.props.places.places.find((place) => { return place.id === this.values.location; });
      if (!placeSelected) throw new Error(`saveLocation - Could not find this location: ${this.values.location}`);
      // logRateContainer.debug(`RateContainer.saveLocation - placeSelected:\n\n${stringifyOnce(placeSelected, null, 2)}`);
      // logRateContainer.debug('placeSelected.geometry: ', placeSelected.geometry);
      // logRateContainer.debug('placeSelected.geometry.location.lat(): ', placeSelected.geometry.location.lat());
      // logRateContainer.debug(`RateContainer.saveLocation - placeSelected.geometry.location:\n\n${stringifyOnce(placeSelected.geometry.location, null, 2)}`);
      const place = {
        name: placeSelected.nameWithoutDistance,
        googleMapId: this.values.location,
        location: {
          type: 'Point',
          coordinates: [placeSelected.geometry.location.lng(), placeSelected.geometry.location.lat()],
        },
      };

      fetch('/api/places/addOrUpdatePlaceByGoogleMapId', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ place }),
      })
      .then((response) => {
        logRateContainer.debug('   fetch result: ', response);
        if (response.ok) {
          logRateContainer.debug('   fetch operation OK');
          // returns the (async) response from server: the saved location (with id)
          resolve(response.json());
        } else {
          // returns the error given by the server (async)
          response.json()
          .then((error) => { throw new Error(error.message); });
        }
      })
      .catch((error) => {
        reject(Error(error.message));
      });
      logRateContainer.debug('} RateContainer.saveLocation');
    });
  }




  saveMarks(savedLocation) {
    logRateContainer.debug(`RateContainer.saveMarks - savedLocation:\n\n${stringifyOnce(savedLocation, null, 2)}`);

    const idLocation = savedLocation.place.id;
    const lat = savedLocation.place.location.coordinates[0];
    const lng = savedLocation.place.location.coordinates[1];

    // Return a new promise.
    return new Promise((resolve, reject) => {
      logRateContainer.debug('{ RateContainer.saveMarks');

      const markIndividual = {
        item: this.values.item,
        place: idLocation,
        markOverall: this.values.markOverall,
        markFood: this.values.markFood,
        markValue: this.values.markValue,
        markPlace: this.values.markPlace,
        markStaff: this.values.markStaff,
        comment: this.values.comment,
        location: {
          type: 'Point',
          coordinates: [lat, lng],
        },
      };
      logRateContainer.debug('   markIndividual: ', markIndividual);

      fetch('/api/markIndividuals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ markIndividual }),
      })
      .then((response) => {
        logRateContainer.debug('   fetch result: ', response);
        if (response.ok) {
          logRateContainer.debug('   fetch operation OK');
          // returns the (async) response from server: the saved markIndividual (with id)
          resolve(response.json());
        } else {
          // returns the error given by the server (async)
          response.json()
          .then((error) => { throw new Error(error.message); });
        }
      })
      .catch((error) => {
        reject(Error(error.message));
      });
      logRateContainer.debug('} RateContainer.saveMarks');
    });
  }


  saveDone(savedMark) {
    logRateContainer.debug(`saveDone - markIndividual saved: ${stringifyOnce(savedMark, null, 2)}`);
    this.onEndSavingOK();
  }



  render() {
    return (
      <Container fluid>
        <RateForm
          ref={(r) => { this._childComponent = r; }}
          kinds={this.props.kinds}
          categories={this.props.categories}
          items={this.props.items}
          places={this.props.places}
          onSubmit={this.onSubmit.bind(this)}
          onRequestAddItem={this.onRequestAddItem.bind(this)}
          onRequestSimulateLocation={this.onRequestSimulateLocation.bind(this)}
        />
        <AddItemContainer
          open={this.state.modalAddItemOpened}
          onClose={this.onCloseModalAddItem.bind(this)}
        />
        <SimulateLocationContainer
          open={this.state.modalSimulateLocation}
          onClose={this.onCloseModalSimulateLocation.bind(this)}
        />
      </Container>
    );
  }
}




const mapStateToProps = (state) => {
  // Add the All to the Kind & Category lists
  const placesWithDistance = state.places.places.map((place) => { return { ...place, nameWithoutDistance: place.name, name: `${place.name} (${place.distanceFormated})` }; });
  return {
    places: { places: placesWithDistance },
    kinds: state.kinds,
    categories: state.categories,
    items: state.items,
  };
};

RateContainer = connect(mapStateToProps)(RateContainer);
export default RateContainer;
