import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';
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
  }


  submitForm(values) {
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
    });
  }

  saveLocation() {
    // Return a new promise.
    return new Promise((resolve, reject) => {
      logRateContainer.debug('{ RateContainer.saveLocation');
      // logRateContainer.debug(`RateContainer.saveLocation - this.props:\n\n${stringifyOnce(this.props, null, 2)}`);

      const placeSelected = this.props.places.places.find((place) => { return place.id === this.values.location; });
      if (!placeSelected) throw new Error('saveLocation - Could not resolve location');
      // logRateContainer.debug(`RateContainer.saveLocation - placeSelected:\n\n${stringifyOnce(placeSelected, null, 2)}`);
      // logRateContainer.debug('placeSelected.geometry: ', placeSelected.geometry);
      // logRateContainer.debug('placeSelected.geometry.location.lat(): ', placeSelected.geometry.location.lat());
      // logRateContainer.debug(`RateContainer.saveLocation - placeSelected.geometry.location:\n\n${stringifyOnce(placeSelected.geometry.location, null, 2)}`);
      const place = {
        name: placeSelected.name,
        googleMapId: this.values.location,
        location: {
          coordinates: [placeSelected.geometry.location.lat(), placeSelected.geometry.location.lng()],
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
          return response.json()
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
    const idLocation = savedLocation.place._id;

    // Return a new promise.
    return new Promise((resolve, reject) => {
      logRateContainer.debug('{ RateContainer.saveMarks');

      const mark = {
        item: this.values.item,
        place: idLocation,
        markOverall: this.values.markOverall,
        markFood: this.values.markFood,
        markPlace: this.values.markPlace,
        markStaff: this.values.markStaff,
      };
      logRateContainer.debug('   mark: ', mark);

      fetch('/api/marks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mark }),
      })
      .then((response) => {
        logRateContainer.debug('   fetch result: ', response);
        if (response.ok) {
          logRateContainer.debug('   fetch operation OK');
          // returns the (async) response from server: the saved mark (with _id)
          resolve(response.json());
        } else {
          // returns the error given by the server (async)
          return response.json()
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
    logRateContainer.debug(`saveDone - mark saved: ${stringifyOnce(savedMark, null, 2)}`);
  }



//         {this.state.alertStatus !== 0 && <Alert color={this.state.alertColor}>{this.state.alertMessage}</Alert>}


  render() {
    return (
      <Container fluid>
        <RateForm onSubmit={this.submitForm} />
      </Container>

    );
  }
}




const mapStateToProps = (state) => { return { places: state.places }; };

RateContainer = reduxForm({ form: 'rate' })(RateContainer); // Decorate the form component
RateContainer = connect(mapStateToProps)(RateContainer);
export default RateContainer;
