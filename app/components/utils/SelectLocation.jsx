/* eslint-disable no-console */
/* global google */

import React, { /* Component */ } from 'react';
import { connect } from 'react-redux';
// import { setCurrentLocation } from '../actions/LocationActions';

import Geolocation from './Geolocation';

// import Formsy from 'formsy-react';
// import FlatButton from 'material-ui/FlatButton';
// import { FormsySelect  , FormsyCheckbox, FormsyDate, FormsyRadio, FormsyRadioGroup, FormsyText, FormsyTime, FormsyToggle, FormsyAutoComplete  } from 'formsy-material-ui/lib';
// import MenuItem from 'material-ui/MenuItem';

const styles = {
  div: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  geolocation: {
  },
  listing: {
  },
  mapDiv1: {
    position: 'relative',
  },
  mapDiv2: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  map: {
    margin: '1em',
    width: '100%',
    height: '400px',
  },
};

const Listing = ({ places }) => {
  console.log('   {   Listing.render (lr)');
  console.log('          (lr) nb places: ', places.length);
  if (places.length > 0) console.log('          (lr) 1st places: ', places[0].name);

  const result = (
    <div>
      <select>
        {places && places.map((p) => { return (<option key={p.id} value={p.id}>{p.name}</option>); })}
      </select>
    </div>
  );

  console.log('   }   Listing.render');
  return result;
};


// @connect(mapStateToProps, mapDispatchToProps)

const SelectLocation = React.createClass({

  getInitialState: () => {
    return {
      places: [],
      nbRenders: 0,
    };
  },


  // 2nd to receive store changes
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    console.log('{   SelectLocation.componentWillReceiveProps (sl-cwrp)');
    console.log('       (sl-cwrp) nextProps: ', nextProps);

    if (!nextProps) {
      console.log('}   SelectLocation.componentWillReceiveProps: nextProps null !!!');
      return;
    }

    if (!nextProps.coordinates) {
      console.log('}   SelectLocation.componentWillReceiveProps: coordinates null !!!');
      return;
    }

    if (!nextProps.coordinates.latitude || !nextProps.coordinates.longitude) {
      console.log('}   SelectLocation.componentWillReceiveProps: lat or long null !!!');
      return;
    }

    if (!nextProps.coordinates.changed) {
      console.log('}   SelectLocation.componentWillReceiveProps: no change in coordinates');
      return;
    }

    const nbRenders = this.state.nbRenders + 1;
    this.setState({ nbRenders });

    const currentLatLng = new google.maps.LatLng(nextProps.coordinates.latitude, nextProps.coordinates.longitude);

    const map = new google.maps.Map(document.getElementById('map'), {
      center: currentLatLng,
      zoom: 15,
    });

    console.log('       (sl-cwrp) currentLatLng : ', currentLatLng);
    const request = {
      location: currentLatLng,
      // radius: '100',
      types: ['restaurant'],
      rankBy: google.maps.places.RankBy.DISTANCE,
    };

    const service = new google.maps.places.PlacesService(map);

    service.nearbySearch(request, (results, status, pagination) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log('          (sl-cwrp) nearby nb results: ', results.length);
        if (results.length > 0) console.log('          (sl-cwrp) nearby 1st results', results[0].name);
        this.pagination = pagination;
        this.setState({
          places: results,
          hasNextPage: pagination.hasNextPage,
          currentLatLng,
        });
      } else {
        console.log('          (sl-cwrp) nearby search error : ', status);
      }
    });

    console.log('}   SelectLocation.componentWillReceiveProps');
  },


  render: function render() {
    console.log('{   SelectLocation.render (slr)');
    console.log('       (slr) state:', this.state);
    console.log('       (slr) props:', this.props);

    const result = (
      <div style={styles.div}>
        <div style={styles.mapDiv1}>
          <div style={styles.mapDiv2}>
            <div id="map" style={styles.map} />
            --map--
          </div>
        </div>
        <Listing
          style={styles.listing}
          places={this.state.places}
        />
        <Geolocation
          style={styles.geolocation}
        />
      </div>
    );
    console.log('}   SelectLocation.render');
    return result;
  },

});

const mapStateToProps = (state) => { return { coordinates: state.coordinates }; };

export default connect(mapStateToProps)(SelectLocation);
