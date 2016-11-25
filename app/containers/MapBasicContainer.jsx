import React from 'react'
import Map, {GoogleApiWrapper} from 'google-maps-react';

const __GAPI_KEY__ = "AIzaSyAPbswfvaojeQVe9eE-0CtZ4iEtWia9KO0";


const MapContainer = React.createClass({
  getInitialState: function() {
    return {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
    }
  },

  onMapMoved: function(props, map) {
    const center = map.center;
    console.log("MapContainer.onMapMoved", center);
  },

  onMarkerClick: function(props, marker, e) {
    console.log("MapContainer.onMarkerClick", marker);
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  },

  onInfoWindowClose: function() {
    console.log("MapContainer.onInfoWindowClose");
    this.setState({
      showingInfoWindow: false,
      activeMarker: null
    })
  },

  onMapClicked: function(props) {
    console.log("MapContainer.onMapClicked", props);
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  },

  render: function() {
    if (!this.props.loaded) {
      return <div>Loading...</div>
    }

    return (
      <Map google={this.props.google}
          style={{width: '100%', height: '100%', position: 'relative'}}
          className={'map'}
          zoom={18}
          containerStyle={{}}
          centerAroundCurrentLocation={true}
          onClick={this.onMapClicked}
          onDragend={this.onMapMoved} />
    )
  }
});

export default GoogleApiWrapper({
  apiKey: __GAPI_KEY__
})(MapContainer)
