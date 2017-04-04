/* global google */

import React, { /* Component */ } from 'react';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import { Col, FormGroup } from 'reactstrap';
import * as log from 'loglevel';
import Geolocation from './Geolocation';
import reactFormSelect from './reactFormSelect';

const logSelectLocation = log.getLogger('logSelectLocation');
logSelectLocation.setLevel('warn');
logSelectLocation.debug('--> entering SelectLocation.jsx');

const Listing = ({ places }) => {
  logSelectLocation.debug('   {   Listing.render (lr)');
  logSelectLocation.debug('          (lr) nb places: ', places.length);
  if (places.length > 0) logSelectLocation.debug('          (lr) 1st places: ', places[0].name);

//  <AvField type="select" name="category" label="Category" size="lg">

  const result = (
    <Field name="location" component={reactFormSelect} size="md">
      {places && places.map((p) => { return (<option key={p.id} value={p.id}>{p.name}</option>); })}
    </Field>
  );

  logSelectLocation.debug('   }   Listing.render');
  return result;
};


// @connect(mapStateToProps, mapDispatchToProps)

const SelectLocation = React.createClass({

  getInitialState: () => {
    return {
      places: [],
      nbRenders: 0,
    };
  },


  // 2nd to receive store changes
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    logSelectLocation.debug('{   SelectLocation.componentWillReceiveProps (sl-cwrp)');
    logSelectLocation.debug('       (sl-cwrp) nextProps: ', nextProps);

    if (!nextProps) {
      logSelectLocation.debug('}   SelectLocation.componentWillReceiveProps: nextProps null !!!');
      return;
    }

    if (!nextProps.coordinates) {
      logSelectLocation.debug('}   SelectLocation.componentWillReceiveProps: coordinates null !!!');
      return;
    }

    if (!nextProps.coordinates.latitude || !nextProps.coordinates.longitude) {
      logSelectLocation.debug('}   SelectLocation.componentWillReceiveProps: lat or long null !!!');
      return;
    }

    if (!nextProps.coordinates.changed) {
      logSelectLocation.debug('}   SelectLocation.componentWillReceiveProps: no change in coordinates');
      return;
    }

    const nbRenders = this.state.nbRenders + 1;
    this.setState({ nbRenders });

    const currentLatLng = new google.maps.LatLng(nextProps.coordinates.latitude, nextProps.coordinates.longitude);

    const map = new google.maps.Map(document.getElementById('map'), {
      center: currentLatLng,
      zoom: 15,
    });

    logSelectLocation.debug('       (sl-cwrp) currentLatLng : ', currentLatLng);
    const request = {
      location: currentLatLng,
      // radius: '100',
      types: ['restaurant'],
      rankBy: google.maps.places.RankBy.DISTANCE,
    };

    const service = new google.maps.places.PlacesService(map);

    service.nearbySearch(request, (results, status, pagination) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        logSelectLocation.debug('          (sl-cwrp) nearby nb results: ', results.length);
        if (results.length > 0) logSelectLocation.debug('          (sl-cwrp) nearby 1st results', results[0].name);
        this.pagination = pagination;
        this.setState({
          places: results,
          hasNextPage: pagination.hasNextPage,
          currentLatLng,
        });
      } else {
        logSelectLocation.debug('          (sl-cwrp) nearby search error : ', status);
      }
    });

    logSelectLocation.debug('}   SelectLocation.componentWillReceiveProps');
  },


  render: function render() {
    logSelectLocation.debug('{   SelectLocation.render (slr)');
    logSelectLocation.debug('       (slr) state:', this.state);
    logSelectLocation.debug('       (slr) props:', this.props);

    const result = (
      <div>
        <div id="map" className="hidden-xs-up" />
        <FormGroup row className="no-gutters">
          <Col xs={11}>
            <Listing
              places={this.state.places}
            />
          </Col>
          <Col xs={1}>
            <Geolocation />
          </Col>
        </FormGroup>
      </div>
    );
    logSelectLocation.debug('}   SelectLocation.render');
    return result;
  },

});

const mapStateToProps = (state) => { return { coordinates: state.coordinates }; };

export default connect(mapStateToProps)(SelectLocation);
