/* global google */
import * as log from 'loglevel';
import React, { /* Component */ } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { distanceInKm, formatDistance } from '../../utils/mapUtils';
import Geolocation from '../utils/Geolocation';
import * as PlacesActions from '../../actions/PlacesActions';

const logRetreiveLocations = log.getLogger('loggerRetreiveLocation');
logRetreiveLocations.setLevel('debug');
logRetreiveLocations.debug('--> entering RetreiveLocations.jsx');



class RetreiveLocations extends React.Component {

  constructor() {
    super();

    this.state = {
      places: [],
      nbRenders: 0,
    };
  }



  // 2nd to receive store changes
  componentWillReceiveProps(nextProps) {
    logRetreiveLocations.debug('{   RetreiveLocations.componentWillReceiveProps (rl-cwrp)');
    logRetreiveLocations.debug('       (rl-cwrp) nextProps: ', nextProps);

    if (!nextProps) {
      logRetreiveLocations.debug('}   RetreiveLocations.componentWillReceiveProps: nextProps null !!!');
      return;
    }

    if (!nextProps.coordinates) {
      logRetreiveLocations.debug('}   RetreiveLocations.componentWillReceiveProps: coordinates null !!!');
      return;
    }

    if (!nextProps.coordinates.latitude || !nextProps.coordinates.longitude) {
      logRetreiveLocations.debug('}   RetreiveLocations.componentWillReceiveProps: lat or long null !!!');
      return;
    }

    if (!nextProps.coordinates.changed) {
      logRetreiveLocations.debug('}   RetreiveLocations.componentWillReceiveProps: no change in coordinates');
      return;
    }

    // const nbRenders = this.state.nbRenders + 1;
    const currentLatLng = new google.maps.LatLng(nextProps.coordinates.latitude, nextProps.coordinates.longitude);

    const map = new google.maps.Map(document.getElementById('map'), {
      center: currentLatLng,
      zoom: 15,
    });

    logRetreiveLocations.debug('       (rl-cwrp) currentLatLng : ', currentLatLng);
    const request = {
      location: currentLatLng,
      // radius: '100',
      types: [nextProps.locationType],
      rankBy: google.maps.places.RankBy.DISTANCE,
    };

    const service = new google.maps.places.PlacesService(map);

    service.nearbySearch(request, (results, status, pagination) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        logRetreiveLocations.debug('          (rl-cwrp) nearby nb results: ', results.length);
        if (results.length > 0) logRetreiveLocations.debug('          (rl-cwrp) nearby 1st results', results[0].name);

        // Add distance from current location to every place
        const resultsWithDistance = results.map((place) => {
          const distance = distanceInKm(place.geometry.location.lat(), place.geometry.location.lng(), currentLatLng.lat(), currentLatLng.lng());
          const distanceFormated = formatDistance(distance);
          //    Note: If maxWidth changed from 250, please update:
          //    - placeController.batchUpdatePlacesWithGooglePhoto method (plus apiRoutes) on server side
          //    - RetreiveLocations.componentWillReceiveProps method on Client side
          //    - .result-item-picture in index.css on Client side
          const googlePhotoUrl = place.photos && place.photos[0] ? place.photos[0].getUrl({ maxWidth: 250 }) : null;
          const id = place.place_id;
          return { ...place, id, distance, distanceFormated, googlePhotoUrl };
        });

        this.pagination = pagination;
        this.setState({
          places: resultsWithDistance,
          hasNextPage: pagination.hasNextPage,
          currentLatLng,
        });

        // Save places in redux store
        const { dispatch } = this.props;  // Injected by react-redux
        const action = PlacesActions.setCurrentPlaces(resultsWithDistance);
        dispatch(action);
      } else {
        logRetreiveLocations.error('          (rl-cwrp) nearby search error : ', status);
      }
    });

    logRetreiveLocations.debug('}   RetreiveLocations.componentWillReceiveProps');
  }




  render() {
    logRetreiveLocations.debug('{   RetreiveLocations.render (rlr)');
    logRetreiveLocations.debug('       (rlr) state:', this.state);
    logRetreiveLocations.debug('       (rlr) props:', this.props);

    const result = (
      <div>
        <div id="map" className="hidden-xs-up" />
        <Geolocation />
      </div>
    );
    logRetreiveLocations.debug('}   RetreiveLocations.render');
    return result;
  }
}



RetreiveLocations.propTypes = {
  coordinates: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    real: PropTypes.boolean,
    changed: PropTypes.boolean,
    changedReal: PropTypes.boolean,
    nbRefreshes: PropTypes.number,
    nbDiffs: PropTypes.number,
    nbReal: PropTypes.number,
    nbEstimated: PropTypes.number,
    nbClose: PropTypes.number,
  }).isRequired,
  locationType: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};


// 1st to receive store changes
// Role of mapStateToProps: transform the "interesting" part of the store state
// into some props that will be received by componentWillReceiveProps
const mapStateToProps = (state) => {
  return { coordinates: state.coordinates, locationType: state.places.locationType };
};

export default connect(mapStateToProps)(RetreiveLocations);
