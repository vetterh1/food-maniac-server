import * as log from 'loglevel';
import React from 'react';
// import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';
import SearchItemForm from './SearchItemForm';
import stringifyOnce from '../../utils/stringifyOnce';

require('es6-promise').polyfill();
require('isomorphic-fetch');

const logSearchItemContainer = log.getLogger('logSearchItemContainer');
logSearchItemContainer.setLevel('debug');
logSearchItemContainer.debug('--> entering SearchItemContainer.jsx');

class SearchItemContainer extends React.Component {
  static propTypes = {
  }

  constructor(props) {
    super(props);
    this.values = null;
    this.submitForm = this.submitForm.bind(this);
  }


  submitForm(values) {
    this.values = values;
    this.findAndDisplayItems();
  }


  findAndDisplayItems() {
    logSearchItemContainer.debug(`SearchItemContainer.findAndDisplayItems - values:\n\n${stringifyOnce(this.values, null, 2)}`);
    this.findItems()
    .then(this.displayItems.bind(this))
    .catch((error) => {
      logSearchItemContainer.error('SearchItemContainer.findAndDisplayItems failed: ', error);
    });
  }

  findItems() {
    // Return a new promise.
    return new Promise((resolve, reject) => {
      logSearchItemContainer.debug('{ SearchItemContainer.displayItems');
      // logSearchItemContainer.debug(`SearchItemContainer.displayItems - this.props:\n\n${stringifyOnce(this.props, null, 2)}`);

      const placeSelected = this.props.places.places.find((place) => { return place.id === this.values.location; });
      if (!placeSelected) throw new Error('displayItems - Could not resolve location');
      // logSearchItemContainer.debug(`SearchItemContainer.displayItems - placeSelected:\n\n${stringifyOnce(placeSelected, null, 2)}`);
      // logSearchItemContainer.debug('placeSelected.geometry: ', placeSelected.geometry);
      // logSearchItemContainer.debug('placeSelected.geometry.location.lat(): ', placeSelected.geometry.location.lat());
      // logSearchItemContainer.debug(`SearchItemContainer.displayItems - placeSelected.geometry.location:\n\n${stringifyOnce(placeSelected.geometry.location, null, 2)}`);
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
        logSearchItemContainer.debug('   fetch result: ', response);
        if (response.ok) {
          logSearchItemContainer.debug('   fetch operation OK');
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
      logSearchItemContainer.debug('} SearchItemContainer.displayItems');
    });
  }




  displayItems(items) {
    const idLocation = items.place._id;

    // Return a new promise.
    return new Promise((resolve, reject) => {
      logSearchItemContainer.debug('{ SearchItemContainer.displayItems');
      logSearchItemContainer.debug('} SearchItemContainer.displayItems');
    });
  }



//         {this.state.alertStatus !== 0 && <Alert color={this.state.alertColor}>{this.state.alertMessage}</Alert>}


  render() {
    return (
      <Container fluid>
        <SearchItemForm onSubmit={this.submitForm} />
      </Container>

    );
  }
}




const mapStateToProps = (state) => { return { places: state.places }; };

SearchItemContainer = reduxForm({ form: 'SearchItem' })(SearchItemContainer); // DecoSearchItem the form component
SearchItemContainer = connect(mapStateToProps)(SearchItemContainer);
export default SearchItemContainer;
