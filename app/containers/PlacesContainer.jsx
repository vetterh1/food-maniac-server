import React, {Component} from 'react';
import { connect } from 'react-redux'
import {setCurrentLocation} from '../actions/LocationActions'
import Map, {GoogleApiWrapper} from 'google-maps-react';

const __GAPI_KEY__ = "AIzaSyAPbswfvaojeQVe9eE-0CtZ4iEtWia9KO0";

const Listing = ({places}) => {

  console.log("   {   Listing.render (lr)" );
  console.log("          (lr) places: ", places );

  let result = (
    <ul>
      {places && places.map(p => {
        return (
          <li key={p.id}>
            {p.name}
          </li>
        )
      })}
    </ul>
  );

  console.log("   }   Listing.render" );
  return result;
}


const mapStateToProps = (state) => {
  console.log("{   PlacesContainer.mapStateToProps (pcms)" );
  console.log("       (pcms) state:", state);
  let result = {
    center: [state.coordinates.latitude, state.coordinates.longitude]
  }
  console.log("       (pcms) result:", result);
  console.log("}   PlacesContainer.mapStateToProps" );
  return result;
}

const mapDispatchToProps = (dispatch) => {
  console.log("{   PlacesContainer.mapDispatchToProps (pcmd)" );
  console.log("       (pcmd) dispatch:", dispatch);
  console.log("}   PlacesContainer.mapDispatchToProps (pcmd)" );
  return {
  }
}

// @connect(mapStateToProps, mapDispatchToProps)

const PlacesContainer = React.createClass({

  getInitialState: function() {
    return {
      places: []
    }
  },

  searchNearby: function(map, center) {
    console.log("{   PlacesContainer.searchNearby (pcs)" );
    console.log("       (pcs) center:", center);
    console.log("       (pcs) map:", map);
    const {google} = this.props;
    const service = new google.maps.places.PlacesService(map);
    // Specify location, radius and place types for your Places API search.
    const request = {
       location: center,
       radius: '5000',
       type: ['food']
     }

    service.nearbySearch(request, (results, status, pagination) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {

        this.pagination = pagination;
        this.setState({
          places: results,
          hasNextPage: pagination.hasNextPage,
          center: center,
        })
      }
    })
    console.log("}   PlacesContainer.searchNearby (pcs)" );
  },

  onMapReady: function (mapProps, map) {
    this.searchNearby(map, map.center);
  },

  render: function () {

    console.log("{   PlacesContainer.render (pcr)" );

    console.log("       (pcr) state:", this.state);
    console.log("       (pcr) props:", this.props)

    const style = {
      width: '80vw',
      height: '50vh'
    }

//    if (!this.state || !this.state.center) {
    if (!this.props.loaded) {
      console.log("       returns loading msg" );
      console.log("}   PlacesContainer.render" );
      return <div>Loading...</div>
    }

    let result = (
      <div style={style}>      
        <Map google={this.props.google}
            className={'map'}
            onReady={this.onMapReady}
            visible={true}
        >

          <Listing places={this.state.places} />
        </Map>
      </div>
    )
    console.log("}   PlacesContainer.render" );
    return result;
  }

});

connect(mapStateToProps, mapDispatchToProps)(PlacesContainer);


export default GoogleApiWrapper({apiKey: __GAPI_KEY__})(PlacesContainer)

