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
    travelMode: PropTypes.string,
  };

  static defaultProps = { travelMode: 'WALKING' };


  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {
    this.update();
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps) return;
    this.update();
  }

  componentDidUpdate() {
    this.update();
  }


  update() {
    const currentLatLng = new google.maps.LatLng(this.props.origin.latitude, this.props.origin.longitude);
    const directionsDisplay = new google.maps.DirectionsRenderer();
    const directionsService = new google.maps.DirectionsService();
    const map = new google.maps.Map(document.getElementById('map-directions'), {
      center: currentLatLng,
      zoom: 15,
    });
    directionsDisplay.setMap(map);
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
