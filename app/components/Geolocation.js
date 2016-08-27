import React, { Component } from 'react';

const GeolocationDisplay = (props) => 
  <div>
    <div className="geolocation_display">
      Latitude: {props.latitude}<br />
      Longitude: {props.longitude}<br /> 
      Real: {props.real?"true":"false"}
    </div>
    <div className="geolocation_statistics">
      Statistics:
      <ul>
        <li>Nb refreshes: {props.nbRefreshes}</li>
        <li>Nb different positions: {props.nbDiffs}</li>
        <li>Nb real positions: {props.nbReal}</li>
        <li>Nb estimated positions: {props.nbEstimated}</li>
      </ul>
    </div>
  </div>;





export default React.createClass({

  watchID: (null: ?number),

  getInitialState: function() {
    return {
      current: {latitude: null, longitude: null, real: false },
      statistics: { nbRefreshes: 0, nbDiffs: 0, nbReal: 0, nbEstimated: 0 }
    };
  },

  componentDidMount: function() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Geolocation.componentDidMount.state before setState", this.state);
        let statistics = this.state.statistics;
        statistics.nbReal++;
        this.setState({
          current: {
            latitude: position.coords.latitude, 
            longitude: position.coords.longitude, 
            real: true 
          }, 
          statistics: statistics
        });
        console.log("Geolocation.componentDidMount.state after setState", this.state);
      },
      (error) => {
        let current = this.state.current;
        current.real = false;
        let statistics = this.state.statistics;
        statistics.nbEstimated++;
        this.setState({
          current: current, 
          statistics: statistics
        });
      },
      {enableHighAccuracy: true, timeout: 3000, maximumAge: 30000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
        let current = {
          latitude: position.coords.latitude, 
          longitude: position.coords.longitude, 
          real: true
        };
        let statistics = this.state.statistics;
        statistics.nbRefreshes++;
        statistics.nbReal++;
        if( current.latitude != this.state.current.latitude || 
            current.longitude != this.state.current.longitude ){
          statistics.nbDiffs++;
        }
        this.setState({ 
          current: current, 
          statistics: statistics
        });
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
        real={this.state.current.real}
        nbRefreshes={this.state.statistics.nbRefreshes} 
        nbDiffs={this.state.statistics.nbDiffs} 
        nbReal={this.state.statistics.nbReal} 
        nbEstimated={this.state.statistics.nbEstimated} />
    );
  }
});
