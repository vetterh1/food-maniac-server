import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setCurrentLocation } from '../actions/LocationActions';

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

const SelectLocation = React.createClass({

  getInitialState: function() {
    return {
      places: [],
      nbRenders: 0
    };
  },


  // 2nd to receive store changes
  componentWillReceiveProps: function(nextProps) {
    console.log('{   SelectLocation.componentWillReceiveProps (cwrp)');
    console.log('       (cwrp) nextProps: ', nextProps);
    const nbRenders = this.state.nbRenders + 1;
    this.setState({ nbRenders });

    // To use for auto complete... 
    // but this is NOT a method to find places 
    // use radarSearch or nearby search instead
    // const service = new google.maps.places.AutocompleteService();
    // service.getQueryPredictions({ input: 'pizza near Syd' }, this.displaySuggestions);

    const pyrmont = new google.maps.LatLng(-33.8665433, 151.1956316);

    const map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 15,
      });

    const request = {
      location: pyrmont,
      radius: '2000',
      types: ['restaurant'],
    };
    console.log("/////////////////////// before service creation /////////////////////");
    const service = new google.maps.places.PlacesService(map);
    console.log("/////////////////////// service created /////////////////////");
    service.radarSearch(request, this.callbackPlaces);

    console.log('}   SelectLocation.componentWillReceiveProps (cwrp)');
  },


  callbackPlaces: (predictions, status) => {
    if (status != google.maps.places.PlacesServiceStatus.OK) {
      alert(status);
      return;
    }
    console.log("/////////////////////// in callbackPlaces /////////////////////");
    predictions.forEach((prediction) => {
      // console.log(prediction);
    });
  },


  render: function() {
    console.log('{   SelectLocation.render (pcr)');
    console.log('       (pcr) state:', this.state);
    console.log('       (pcr) props:', this.props);


/*    if (!this.props.loaded ) {
      console.log('       returns loading msg');
      console.log('}   SelectLocation.render');
      return <div><Geolocation style="{styles.geolocation}" />Loading...</div>;
    }
*/
    const result = (
      <div style={styles.div}>
        <div style={styles.mapDiv1}>
          <div style={styles.mapDiv2}>
            <div id="map" style={styles.map}></div>


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

// 1st to receive store changes
// Role of mapStateToProps: transform the "interesting" part of the store state
// into some props that will be received by componentWillReceiveProps
const mapStateToProps = function(state) {
  console.log('{   SelectLocation.mapStateToProps (pcms)');
  console.log('       (pcms) state:', state);
  const result = {
    // center: [state.coordinates.latitude, state.coordinates.longitude]
    position: { lat: state.coordinates.latitude, lng: state.coordinates.longitude }
  };
  console.log('       (pcms) result:', result);
  console.log('}   SelectLocation.mapStateToProps');
  return result;
};

const mapDispatchToProps = function(dispatch) {
  console.log('{   SelectLocation.mapDispatchToProps (pcmd)');
  console.log('       (pcmd) dispatch:', dispatch);
  console.log('}   SelectLocation.mapDispatchToProps (pcmd)');
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectLocation);
