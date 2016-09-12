import React, {Component} from 'react';
import { connect } from 'react-redux'
import GoogleMap from 'google-map-react';
import {setCurrentLocation} from '../actions/LocationActions'


const mapStateToProps = (state) => {
  return {
    center: [state.coordinates.latitude, state.coordinates.longitude]
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

@connect(mapStateToProps, mapDispatchToProps)

export default class MapContainer extends Component {

  static defaultProps = {
    bootstrapURLKeys: {key: "AIzaSyAPbswfvaojeQVe9eE-0CtZ4iEtWia9KO0"},
    center: [50.5467501, 3.0290698999999996],
    zoom: 20,
    greatPlaces: [
      {id: 'A', lat: 59.955413, lng: 30.337844},
      {id: 'B', lat: 59.724, lng: 30.080}
    ]
  };

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












