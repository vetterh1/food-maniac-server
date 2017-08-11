/* eslint-disable react/forbid-prop-types */

import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
import ListOneMark from './ListOneMark';
import Alert from 'react-s-alert';


const logListOneMarkContainer = log.getLogger('logListOneMarkContainer');
logListOneMarkContainer.setLevel('debug');
logListOneMarkContainer.debug('--> entering ListOneMarkContainer.jsx');

export default class ListOneMarkContainer extends React.Component {

  static propTypes = {
    markAggregate: PropTypes.object.isRequired,
    // index: PropTypes.number.isRequired,
    // key: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
    };

    this.alert = null;
  }


  onStartSearching = () => {
    this._nowStartSaving = new Date().getTime();
    this.alert = Alert.info('Searching...');
  }

  onEndSearchingOK = (nbItems) => {
    const durationSearching = new Date().getTime() - this._nowStartSaving;
    if (this.alert) Alert.update(this.alert, `${nbItems} marks(s) found! (duration=${durationSearching}ms)`, 'success');
    else this.alert = Alert.success(`${nbItems} marks(s) found! (duration=${durationSearching}ms)`);
  }

  onEndSearchingNoResults = () => {
    const durationSearching = new Date().getTime() - this._nowStartSaving;
    if (this.alert) Alert.update(this.alert, `No results found (duration=${durationSearching}ms)`, 'warning');
    else this.alert = Alert.warning(`No results found (duration=${durationSearching}ms)`);
  }


  onEndSearchingFailed = (errorMessage) => {
    const durationSearching = new Date().getTime() - this._nowStartSaving;
    if (this.alert) Alert.update(this.alert, `Error while searching (error=${errorMessage}, duration=${durationSearching}ms)`, 'error');
    else this.alert = Alert.error(`Error while searching (error=${errorMessage}, duration=${durationSearching}ms)`);
  }




  onRequestIndividualMarks() {
    console.log('onRequestIndividualMarks');
    this.onStartSearching();
    this.FindIndividualMarks()
    .catch((error) => { logListOneMarkContainer.error('ListOneMarkContainer.onRequestIndividualMarks caught exception: ', error.message); });
  }


  FindIndividualMarks() {
    // Return a new promise.
    return new Promise((resolve, reject) => {
      logListOneMarkContainer.warn('{ ListOneMarkContainer.FindIndividualMarks');
      // logSearchItemContainer.warn(`SearchItemContainer.FindIndividualMarks - this.props.coordinates:\n\n${stringifyOnce(this.props.coordinates, null, 2)}`);

      fetch(`/api/markIndividuals/markAggregateId/${this.props.markAggregate._id}`)
      .then((response) => {
        if (response.status >= 400) {
          this.onEndSearchingFailed(response.status);
          const error = new Error(`Bad response from server: ${response.status} (request: /api/markIndividuals/markAggregateId/...)`);
          error.name = 'ErrorCaught';
          throw (error);
        } else {
          return response.json();
        }
      }).then((jsonResponse) => {
        if (!jsonResponse || jsonResponse.error) {
          this.onEndSearchingFailed('02');
          const error = new Error('fetch OK but returned nothing or an error (request: /api/markIndividuals/markAggregateId/...)');
          error.name = 'ErrorCaught';
          throw (error);
        }
        if (!jsonResponse.markIndividuals) {
          this.onEndSearchingFailed('03');
          const error = new Error('jsonResponse.markIndividuals undefined (request: /api/markIndividuals/markAggregateId/...)');
          error.name = 'ErrorCaught';
          throw (error);
        }
        if (jsonResponse.markIndividuals.length >= 0) {
          console.log('onRequestIndividualMarks: ', jsonResponse.markIndividuals);
          logListOneMarkContainer.debug('onRequestIndividualMarks: ', jsonResponse.markIndividuals);
          this.setState({ markIndividuals: jsonResponse.markIndividuals });
          if (jsonResponse.markIndividuals.length > 0) this.onEndSearchingOK(jsonResponse.markIndividuals.length);
          else this.onEndSearchingNoResults();
        }
      }).catch((error) => {
        if (error.name !== 'ErrorCaught') this.onEndSearchingFailed('04');
        reject(error);
      });
      logListOneMarkContainer.warn('} ListOneMarkContainer.FindIndividualMarks');
    });
  }


  render() {
    const { markAggregate } = this.props;
    const { markIndividuals } = this.state;

    return (<ListOneMark
      markAggregate={markAggregate}
      markIndividuals={markIndividuals}
      key={markAggregate._id}
      onRequestIndividualMarks={() => this.onRequestIndividualMarks()}
    />);
  }

}

ListOneMarkContainer.defaultProps = {};
