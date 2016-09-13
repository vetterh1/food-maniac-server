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


// @connect(mapStateToProps, mapDispatchToProps)

const PlacesContainer = React.createClass({

  getInitialState: function() {
    return {
      places: [],
      nbRenders: 0
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
       radius: '1000',
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
      width: '80%',
      height: '50%'
    }

    // Search again for new places 
    // !!!! should NOT be here... 
    // but it should be called when detecting new pos
    // but not all the time !
    this.searchNearby(map, map.center);
    let nbRenders = this.state.nbRenders + 1;
    this.setState({ nbRenders: nbRenders});


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
            visible={false}
            center={this.props.position}
        >

          <Listing places={this.state.places} />
          <div>Nb renders: {nbRenders}</div>
        </Map>
      </div>
    )
    console.log("}   PlacesContainer.render" );
    return result;
  }

});

const mapStateToProps = (state) => {
  console.log("{   PlacesContainer.mapStateToProps (pcms)" );
  console.log("       (pcms) state:", state);
  let result = {
    //center: [state.coordinates.latitude, state.coordinates.longitude]
    position: { lat: state.coordinates.latitude, lng: state.coordinates.longitude }    
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

let PlacesContainerWrapped = connect(mapStateToProps, mapDispatchToProps)(PlacesContainer);
export default GoogleApiWrapper({apiKey: __GAPI_KEY__})(PlacesContainerWrapped);

// Works too! :
// let PlacesContainerWrapped = GoogleApiWrapper({apiKey: __GAPI_KEY__})(PlacesContainer);
// export default connect(mapStateToProps, mapDispatchToProps)(PlacesContainerWrapped);
