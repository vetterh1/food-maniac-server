/* global google */

import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
import { Col, Container, Row } from 'reactstrap';

const logGoogleDirections = log.getLogger('logGoogleDirections');
logGoogleDirections.setLevel('debug');
logGoogleDirections.debug('--> entering GoogleDirections.jsx');

export default class GoogleDirections extends React.Component {
  static propTypes = {
    origin: PropTypes.object.isRequired,
    destination: PropTypes.string.isRequired,
    forceUpdate: PropTypes.bool.isRequired,
    onUpdated: PropTypes.func.isRequired,
    travelMode: PropTypes.string,
  };

  static defaultProps = { travelMode: 'WALKING' };


  constructor(props) {
    super(props);

    this._mapGoogle = null;

    this.state = {
    };
  }

  componentDidMount() {
    logGoogleDirections.debug('GoogleDirections.componentDidMount: update! - props:', this.props);
    this.update();
  }

  componentWillReceiveProps(nextProps) {
    // Update only when parents tells to!
    if (!nextProps || !nextProps.forceUpdate) {
      logGoogleDirections.debug('GoogleDirections.componentWillReceiveProps: No update - nextProps:', nextProps);
      return;
    }
    logGoogleDirections.debug('GoogleDirections.componentWillReceiveProps: update! - nextProps:', nextProps);
    this.update();
  }

  componentDidUpdate() {
    // this.update();
  }


  update() {
    logGoogleDirections.debug('{ GoogleDirections.update (gd-upd)');

    // Ask parent NOT to turn off the forceUpdate flag
    this.props.onUpdated();

    const currentLatLng = new google.maps.LatLng(this.props.origin.latitude, this.props.origin.longitude);
    const directionsDisplay = new google.maps.DirectionsRenderer();
    const directionsService = new google.maps.DirectionsService();
    this._mapGoogle = new google.maps.Map(document.getElementById('map-directions'), {
      center: currentLatLng,
      zoom: 15,
    });

    logGoogleDirections.debug('    gd-upd - currentLatLng, _mapGoogle: ', currentLatLng, this._mapGoogle);

    directionsDisplay.setMap(this._mapGoogle);
    directionsDisplay.setPanel(document.getElementById('text-directions'));

    directionsService.route({
      origin: currentLatLng,
      destination: { placeId: this.props.destination },
      travelMode: this.props.travelMode,
    }, (response, status) => {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
        console.log('response:', response);
      } else {
        console.error(`Directions request failed due to ${status}`);
        //
        // TODO: manage error case
        //
      }
    });
  }




  render() {
    logGoogleDirections.debug('GoogleDirections.render');
    return (
      <div>
        ------- Directions -------
        <div id="map-directions" className="" />
        <div id="text-directions" />
        --------------------------
      </div>
    );
  }

}
