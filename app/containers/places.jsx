import React, {Component} from 'react';
import { connect } from 'react-redux'
import {setCurrentLocation} from '../actions/LocationActions'
import Map, {GoogleApiWrapper} from 'google-maps-react';

const __GAPI_KEY__ = "AIzaSyAPbswfvaojeQVe9eE-0CtZ4iEtWia9KO0";

const Listing = ({places}) => {

  console.log("Listing places", places );

  return (
    <ul>
      {places && places.map(p => {
        return (
          <li key={p.id}>
            {p.name}
          </li>
        )
      })}
    </ul>
  )
}


const mapStateToProps = (state) => {
  console.log("PlacesContainer.mapStateToProps state:", state)
  console.log("PlacesContainer.mapStateToProps latitude:" + state.coordinates.latitude + "longitude: " + state.coordinates.longitude)
  return {
    center: [state.coordinates.latitude, state.coordinates.longitude]
  }
}

const mapDispatchToProps = (dispatch) => {
  console.log("PlacesContainer.mapDispatchToProps dispatch:", dispatch)
  return {
  }
}

@connect(mapStateToProps, mapDispatchToProps)

class PlacesContainer extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      places: []
    };
  }

  test(){
    console.log("!!!!!!!!!!!test");
  }

  searchNearby(map, center) {
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
  }

  onMapReady (mapProps, map) {
    this.test(); // KO here !!!!!!!!!!!!!!
    this.searchNearby(map, map.center);
  }

  render () {

    this.test(); // OK here
    
    console.log("PlacesContainer.render state:", this.state);
    console.log("PlacesContainer.render props:", this.props)

//    if (!this.state || !this.state.center) {
    if (!this.props.loaded) {
      return <div>Loading...</div>
    }

    return (
      <Map google={this.props.google}
          className={'map'}
          onReady={this.onMapReady}
          visible={false}>

        <Listing places={this.state.places} />
      </Map>
    )
  }

}

export default GoogleApiWrapper({
  apiKey: __GAPI_KEY__
})(PlacesContainer)
