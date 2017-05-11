import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
// import { reduxForm, reset } from 'redux-form';
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
    // Injected by redux-store connect:
    kinds: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    items: PropTypes.array.isRequired,
    places: PropTypes.shape({
      places: PropTypes.array.isRequired,
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.values = null;
    this.submitForm = this.submitForm.bind(this);
    this.onSearchItemError = this.onSearchItemError.bind(this);
    this.onSelectLocationError = this.onSelectLocationError.bind(this);
    this.onChangeKind = this.onChangeKind.bind(this);
    this.onChangeCategory = this.onChangeCategory.bind(this);
    this.onChangeItem = this.onChangeItem.bind(this);
    this.onChangeLocation = this.onChangeLocation.bind(this);
    this.onChangeMarkOverall = this.onChangeMarkOverall.bind(this);
    this.onChangeMarkFood = this.onChangeMarkFood.bind(this);
    this.onChangeMarkValue = this.onChangeMarkValue.bind(this);
    this.onChangeMarkPlace = this.onChangeMarkPlace.bind(this);
    this.onChangeMarkStaff = this.onChangeMarkStaff.bind(this);
    this.onChangeComment = this.onChangeComment.bind(this);
    this.getVisibleItems = this.getVisibleItems.bind(this);
    this._childComponent = null;

    this.state = {
      // Full list of Kinds, Categories & Items:
      kinds: props.kinds,
      categories: props.categories,
      items: props.items,
      // Selected Kind, Category & Item:
      kind: null,
      category: null,
      item: null,
      // alertStatus possible values:
      // -  0: no alerts
      //  - saving alerts:  1: saving, 2: saving OK
      //                   -1: saving KO, -2: SearchItem error; -3: Search places error
      alertStatus: 0,
      alertMessage: '',
    };
  }



  componentWillReceiveProps(nextProps) {
    if (!nextProps) return;
    let needUpdate = false;
    const updState = {};
    if (nextProps.kinds && nextProps.kinds !== this.state.kinds) { updState.kinds = nextProps.kinds; needUpdate = true; }
    if (nextProps.categories && nextProps.categories !== this.state.categories) { updState.categories = nextProps.categories; needUpdate = true; }
    if (nextProps.items && nextProps.items !== this.state.items) { updState.items = nextProps.items; needUpdate = true; }
    if (needUpdate) { this.setState(updState); }
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

    // Tell the form to reset
    const { dispatch } = this.props;  // Injected by react-redux
    dispatch(reset('RateForm'));
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

  onChangeKind(event) {
    if (this.state.kind === event.target.value) return;
    this.setState({ kind: event.target.value, items: this.getVisibleItems(event.target.value, this.state.category) });
  }

  onChangeCategory(event) {
    if (this.state.category === event.target.value) return;
    this.setState({ category: event.target.value, items: this.getVisibleItems(this.state.kind, event.target.value) });
  }

  onChangeItem(event) {
    if (this.state.item === event.target.value) return;
    this.setState({ item: event.target.value });
  }


  getVisibleItems(kind, category) {
    return this.props.items.filter((item) => {
      const kindCondition = (kind && kind !== undefined && kind !== '--all--' ? item.kind === kind : true);
      const categoryCondition = (category && category !== undefined && category !== '--all--' ? item.category === category : true);
      return kindCondition && categoryCondition;
    });
  }

          
  onChangeLocation(event) {
    // if (this.state.category === event.target.value) return;
    // this.setState({ category: event.target.value, items: this.getVisibleItems(this.state.kind, event.target.value) });
  }


  onChangeMarkOverall(event) {
  }

  onChangeMarkFood(event) {
  }

  onChangeMarkPlace(event) {
  }

  onChangeMarkValue(event) {
  }

  onChangeMarkStaff(event) {
  }

  onChangeComment(event) {
  }


  onSubmit(event) {
    event.preventDefault();

    // this.onStartSearching();
    // this.FindMarks()
    // .catch((error) => { logSearchItemContainer.error('submitForm caught exception: ', error.message); });
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
        markValue: this.values.markValue,
        markPlace: this.values.markPlace,
        markStaff: this.values.markStaff,
        comment: this.values.comment,
        location: {
          type: 'Point',
          coordinates: [lat, lng],
        },
      };
      console.log('   markIndividual: ', markIndividual);

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
        <RateForm
          ref={(r) => { this._childComponent = r; }}
          kinds={this.state.kinds}
          categories={this.state.categories}
          items={this.state.items}
          onSubmit={this.onSubmit}
          onChangeKind={this.onChangeKind}
          onChangeCategory={this.onChangeCategory}
          onChangeItem={this.onChangeItem}
          onChangeLocation={this.onChangeLocation}
          onChangeMarkOverall={this.onChangeMarkOverall}
          onChangeMarkFood={this.onChangeMarkFood}
          onChangeMarkValue={this.onChangeMarkValue}
          onChangeMarkPlace={this.onChangeMarkPlace}
          onChangeMarkStaff={this.onChangeMarkStaff}
          onChangeComment={this.onChangeComment}
        />
      </Container>

    );
  }
}




// const mapStateToProps = (state) => { return { places: state.places }; };
const mapStateToProps = (state) => {
  // Add the All to the Kind & Category lists
  const kinds = [{ _id: '--all--', name: 'All' }, ...state.kinds.kinds];
  const categories = [{ _id: '--all--', name: 'All' }, ...state.categories.categories];
  return {
    places: state.places,
    kinds,
    categories,
    items: state.items.items,
  };
};

// RateContainer = reduxForm({ form: 'rate' })(RateContainer); // Decorate the form component
RateContainer = connect(mapStateToProps)(RateContainer);
export default RateContainer;
