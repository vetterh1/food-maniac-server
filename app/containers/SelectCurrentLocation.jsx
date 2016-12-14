import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setCurrentLocation } from '../actions/LocationActions';
import Map, { GoogleApiWrapper } from 'google-maps-react';

import Geolocation from '../components/Geolocation';

import Formsy from 'formsy-react';
import { FormsyCheckbox, FormsyDate, FormsyRadio, FormsyRadioGroup,
          FormsySelect, FormsyText, FormsyTime, FormsyToggle, FormsyAutoComplete } from 'formsy-material-ui/lib';
import MenuItem from 'material-ui/MenuItem';

const __GAPI_KEY__ = 'AIzaSyAPbswfvaojeQVe9eE-0CtZ4iEtWia9KO0';



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
  console.log('          (lr) places: ', places);

  const result = (
    <div>
      <FormsySelect
        name="where"
        required
      >
        {places && places.map((p) => { return (<MenuItem key={p.id} value={p.id} primaryText={p.name} />); })}
      </FormsySelect>
    </div>
  );

  console.log('   }   Listing.render');
  return result;
};


// @connect(mapStateToProps, mapDispatchToProps)

const SelectCurrentLocation = React.createClass({

  getInitialState: function() {
    return {
      places: [],
      nbRenders: 0
    };
  },

  onMapReady: function(mapProps, map) {
    console.log('!!! onMapReady.mapProps: ', mapProps);
    console.log('!!! onMapReady.map: ', map);
    this.searchNearby(map, map.center);
  },

  searchNearby: function(map, center) {
    console.log('{   SelectCurrentLocation.searchNearby (pcs)');
    console.log('       (pcs) center:', center);
    console.log('       (pcs) map:', map);
    const { google } = this.props;
    const service = new google.maps.places.PlacesService(map);
    // Specify location, radius and place types for your Places API search.
    const request = {
       location: center,
       radius: '1000',
       type: ['food']
     };

    service.nearbySearch(request, (results, status, pagination) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        this.pagination = pagination;
        this.setState({
          places: results,
          hasNextPage: pagination.hasNextPage,
          center,
        });
      }
    });
    console.log('}   SelectCurrentLocation.searchNearby (pcs)');
  },

  onMapRecentered: function(mapProps, map) {
    console.log('!!! onMapRecentered.mapProps: ', mapProps);
    console.log('!!! onMapRecentered.map: ', map);
    this.searchNearby(map, map.center);
  },

  // 2nd to receive store changes
  componentWillReceiveProps: function(nextProps) {
    console.log('{   SelectCurrentLocation.componentWillReceiveProps (cwrp)');
    console.log('       (cwrp) nextProps: ', nextProps);
    const nbRenders = this.state.nbRenders + 1;
    this.setState({ nbRenders });
    console.log('}   SelectCurrentLocation.componentWillReceiveProps (cwrp)');
  },

  render: function() {
    console.log('{   SelectCurrentLocation.render (pcr)');
    console.log('       (pcr) state:', this.state);
    console.log('       (pcr) props:', this.props);


// should check why listing ko

//    if (!this.state || !this.state.center || !this.props.position.lat) {
//    if (!this.state || !this.state.center) {
//    if (!this.props.loaded || !this.props.position.lat ) {
    if (!this.props.loaded ) {
      console.log('       returns loading msg');
      console.log('}   SelectCurrentLocation.render');
      return <div><Geolocation style="{styles.geolocation}" />Loading...</div>;
    }

    const result = (
      <div style={styles.div}>
        <div style={styles.mapDiv1}>
          <div style={styles.mapDiv2}>
            <Map
              style={styles.map}
              google={this.props.google}
              className={'map'}
              onReady={this.onMapReady}
              visible={true}
              center={this.props.position}
              onRecenter={this.onMapRecentered}
            />
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
    console.log('}   SelectCurrentLocation.render');
    return result;
  },

});

// 1st to receive store changes
// Role of mapStateToProps: transform the "interesting" part of the store state
// into some props that will be received by componentWillReceiveProps
const mapStateToProps = function(state) {
  console.log('{   SelectCurrentLocation.mapStateToProps (pcms)');
  console.log('       (pcms) state:', state);
  const result = {
    // center: [state.coordinates.latitude, state.coordinates.longitude]
    position: { lat: state.coordinates.latitude, lng: state.coordinates.longitude }
  };
  console.log('       (pcms) result:', result);
  console.log('}   SelectCurrentLocation.mapStateToProps');
  return result;
};

const mapDispatchToProps = function(dispatch) {
  console.log('{   SelectCurrentLocation.mapDispatchToProps (pcmd)');
  console.log('       (pcmd) dispatch:', dispatch);
  console.log('}   SelectCurrentLocation.mapDispatchToProps (pcmd)');
  return {
  };
};

const SelectCurrentLocationWrapped = connect(mapStateToProps, mapDispatchToProps)(SelectCurrentLocation);
export default GoogleApiWrapper({ apiKey: __GAPI_KEY__ })(SelectCurrentLocationWrapped);

// Works too! :
// let SelectCurrentLocationWrapped = GoogleApiWrapper({apiKey: __GAPI_KEY__})(SelectCurrentLocation);
// export default connect(mapStateToProps, mapDispatchToProps)(SelectCurrentLocationWrapped);
