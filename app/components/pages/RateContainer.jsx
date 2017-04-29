import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { Alert, Container } from 'reactstrap';
import RateForm from './RateForm';
import stringifyOnce from '../../utils/stringifyOnce';

require('es6-promise').polyfill();
require('isomorphic-fetch');

const logRateContainer = log.getLogger('logRateContainer');
logRateContainer.setLevel('warn');
logRateContainer.debug('--> entering RateContainer.jsx');

class RateContainer extends React.Component {
  static propTypes = {
    places: PropTypes.shape({
      places: PropTypes.array.isRequired,
    }).isRequired,
  }

  constructor(props) {
    super(props);
    this.values = null;
    this.submitForm = this.submitForm.bind(this);
    this.onSearchItemError = this.onSearchItemError.bind(this);
    this.onSelectLocationError = this.onSelectLocationError.bind(this);
    this._childComponent = null;

    this.state = {
      // alertStatus possible values:
      // -  0: no alerts
      //  - saving alerts:  1: saving, 2: saving OK
      //                   -1: saving KO, -2: SearchItem error; -3: Search places error
      alertStatus: 0,
      alertMessage: '',
    };
  }


  onStartSaving = () => {
    this._nowStartSaving = new Date().getTime();
    this.setState({ alertStatus: 1, alertColor: 'info', alertMessage: 'Saving...' });
    window.scrollTo(0, 0);
  }

  onEndSavingOK = () => {
    const durationSaving = new Date().getTime() - this._nowStartSaving;
    this.setState({ alertStatus: 2, alertColor: 'success', alertMessage: `Saved! (duration=${durationSaving}ms)` });
    setTimeout(() => { this.setState({ alertStatus: 0 }); }, 3000);

    // Tell the child to reset
    if (this._childComponent) this._childComponent.resetForm();
  }

  onEndSavingFailed = (errorMessage) => {
    const durationSaving = new Date().getTime() - this._nowStartSaving;
    this.setState({ alertStatus: -1, alertColor: 'danger', alertMessage: `Error while saving (error=${errorMessage}, duration=${durationSaving}ms)` });
  }

  onSearchItemError = (errorMessage) => {
    this.setState({ alertStatus: -2, alertColor: 'danger', alertMessage: `Error while constructing items list (error=${errorMessage})` });
  }

  onSelectLocationError = (errorMessage) => {
    this.setState({ alertStatus: -2, alertColor: 'danger', alertMessage: `Error while constructing places list (error=${errorMessage})` });
  }



  submitForm(values) {
    this.onStartSaving();
    this.values = values;
    this.save();
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
      if (!placeSelected) throw new Error(`saveLocation - Could not resolve location - props.places.places:\n\n${stringifyOnce(this.props.places.places, null, 2)}`);
      // logRateContainer.debug(`RateContainer.saveLocation - placeSelected:\n\n${stringifyOnce(placeSelected, null, 2)}`);
      // logRateContainer.debug('placeSelected.geometry: ', placeSelected.geometry);
      // logRateContainer.debug('placeSelected.geometry.location.lat(): ', placeSelected.geometry.location.lat());
      // logRateContainer.debug(`RateContainer.saveLocation - placeSelected.geometry.location:\n\n${stringifyOnce(placeSelected.geometry.location, null, 2)}`);
      const place = {
        name: placeSelected.name,
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
          // returns the (async) response from server: the saved location (with _id)
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

    const idLocation = savedLocation.place._id;
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
          // returns the (async) response from server: the saved markIndividual (with _id)
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



//         {this.state.alertStatus !== 0 && <Alert color={this.state.alertColor}>{this.state.alertMessage}</Alert>}


  render() {
    return (
      <Container fluid>
        {this.state.alertStatus !== 0 && <Alert color={this.state.alertColor}>{this.state.alertMessage}</Alert>}
        <RateForm ref={(r) => { this._childComponent = r; }} onSubmit={this.submitForm} onSearchItemError={this.onSearchItemError} onSelectLocationError={this.onSelectLocationError} />
      </Container>

    );
  }
}




const mapStateToProps = (state) => { return { places: state.places }; };

RateContainer = reduxForm({ form: 'rate' })(RateContainer); // Decorate the form component
RateContainer = connect(mapStateToProps)(RateContainer);
export default RateContainer;
