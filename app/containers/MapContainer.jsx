import React, {Component} from 'react';
import { connect } from 'react-redux'
import GoogleMap from 'google-map-react';
import {setCurrentLocation} from '../actions/LocationActions'


const mapStateToProps = (state) => {
  let lat = state.coordinates.latitude;
  let lng = state.coordinates.longitude;
  let center = {lat: lat, lng: lng };

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

@connect(mapStateToProps, mapDispatchToProps)

export default class MapContainerOld extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <GoogleMap
        bootstrapURLKeys={{
        key: "AIzaSyAPbswfvaojeQVe9eE-0CtZ4iEtWia9KO0"
        }}
        defaultCenter={this.props.center}
        defaultZoom={this.props.zoom}>
      </GoogleMap>
    );
  }
}












