import React, {Component} from 'react';
import { connect } from 'react-redux'
import GoogleMap from 'google-map-react';
import {setCurrentLocation} from '../actions/LocationActions'

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed)
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed)
  }
}

const mapStateToProps = (state) => {
  let lat = state.coordinates.latitude;
  let lng = state.coordinates.longitude;
  let center = {lat: lat, lng: lng };
  
  console.log("LVE mapStateToProps state", state);
  console.log("LVE mapStateToProps defaultCenter", center);

  return {
    bootstrapURLKeys: {key: "AIzaSyAPbswfvaojeQVe9eE-0CtZ4iEtWia9KO0"},
    defaultCenter: {lat: 50.5467501, lng: 3.0290698999999996},
    center: center,
    defaultZoom: 20
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

const MapContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GoogleMap)

export default MapContainer




/*
      <GoogleMap
        bootstrapURLKeys={{key: "AIzaSyAPbswfvaojeQVe9eE-0CtZ4iEtWia9KO0"}}
        defaultCenter={this.props.center}
        defaultZoom={this.props.zoom}>
      </GoogleMap>
*/