import React, { Component } from 'react';

const GeolocationDisplay = (props) => 
        <div>
            Current Latitude / Longitude: {props.latitude} / {props.longitude} <br />
            Nb Refreshes / Nb diffs: {props.nbRefreshes} / {props.nbDiffs}
        </div>;





export default React.createClass({

  watchID: (null: ?number),

  getInitialState: function() {
    return {
      current: {latitude: null, longitude: null },
      nbRefreshes: 0,
      nbDiffs: 0
    };
  },

  componentDidMount: function() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({current: {latitude: position.coords.latitude, longitude: position.coords.longitude}});
      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 50000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
        let current = {latitude: position.coords.latitude, longitude: position.coords.longitude};
        if( current.latitude != this.state.current.latitude || current.longitude != this.state.current.longitude )
          this.setState({nbDiffs: this.state.nbDiffs + 1});
        this.setState({current: current, nbRefreshes: this.state.nbRefreshes + 1});
    });
  },

  componentWillUnmount: function() {
    navigator.geolocation.clearWatch(this.watchID);
  },

  render () {
    let displayLatitude = Math.round(this.state.current.latitude * 10000) / 10000;
    let displayLongitude = Math.round(this.state.current.longitude * 10000) / 10000;
    return (
      <GeolocationDisplay 
        latitude={displayLatitude} 
        longitude={displayLongitude} 
        nbRefreshes={this.state.nbRefreshes} 
        nbDiffs={this.state.nbDiffs} />
    );
  }
});
