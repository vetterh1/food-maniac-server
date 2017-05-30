/* eslint-disable no-class-assign */
/* eslint-disable react/forbid-prop-types */

import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Row, Table } from 'reactstrap';
import Alert from 'react-s-alert';
import SearchItemForm from './SearchItemForm';

require('es6-promise').polyfill();
require('isomorphic-fetch');

const logSearchItemContainer = log.getLogger('logSearchItemContainer');
logSearchItemContainer.setLevel('warn');
logSearchItemContainer.debug('--> entering SearchItemContainer.jsx');

// To round to the next 0.5: (Math.round(rating * 2) / 2).toFixed(1)
function roundTo0dot5(n) { return n ? (Math.round(n * 2) / 2).toFixed(1) : null; }

const ListOneMark = (props) => {
  const { markAggregate } = props;
  return (
    <tr>
      <th scope="row">{markAggregate.place.name}</th>
      <td>{roundTo0dot5(markAggregate.markOverall)}</td>
      <td>{roundTo0dot5(markAggregate.markFood)}</td>
      <td>{roundTo0dot5(markAggregate.markValue)}</td>
      <td>{roundTo0dot5(markAggregate.markPlace)}</td>
      <td>{roundTo0dot5(markAggregate.markStaff)}</td>
      <td>{markAggregate.nbMarksOverall}</td>
      <td>{markAggregate.distanceFormated}</td>
    </tr>
  );
};

ListOneMark.propTypes = {
  // index: PropTypes.number.isRequired,
  markAggregate: PropTypes.object.isRequired,
};




class SearchItemContainer extends React.Component {
  static propTypes = {
    // Injected by redux-store connect:
    coordinates: PropTypes.object.isRequired,
    kinds: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    items: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
    this.values = null;

    this._childComponent = null;

    this.state = {
      // Results:
      markAggregates: null,
    };

    this.alert = null;
  }



  onStartSearching = () => {
    this._nowStartSaving = new Date().getTime();
    this.alert = Alert.info('Searching...');
  }

  onEndSearchingOK = (nbItems) => {
    const durationSearching = new Date().getTime() - this._nowStartSaving;
    this.alert = Alert.success(`${nbItems} item(s) found! (duration=${durationSearching}ms)`);
  }

  onEndSearchingNoResults = () => {
    const durationSearching = new Date().getTime() - this._nowStartSaving;
    this.alert = Alert.warning(`No results found (duration=${durationSearching}ms)`);
  }


  onEndSearchingFailed = (errorMessage) => {
    const durationSearching = new Date().getTime() - this._nowStartSaving;
    this.alert = Alert.error(`Error while searching (error=${errorMessage}, duration=${durationSearching}ms)`);
  }


  onSubmit(values) {
    this.onStartSearching();
    this.values = values;
    this.FindMarks()
    .catch((error) => { logSearchItemContainer.error('submitForm caught exception: ', error.message); });
  }

  resetForm() {
    // Clear the results list
    this.setState({ markAggregates: null });
  }

  FindMarks() {
    // Return a new promise.
    return new Promise((resolve, reject) => {
      logSearchItemContainer.warn('{ SearchItemContainer.FindMarks');
      // logSearchItemContainer.warn(`SearchItemContainer.FindMarks - this.props.coordinates:\n\n${stringifyOnce(this.props.coordinates, null, 2)}`);

      fetch(`/api/markAggregates/itemId/${this.values.item}/maxDistance/${this.values.distance}/lat/${this.props.coordinates.latitude}/lng/${this.props.coordinates.longitude}`)
      .then((response) => {
        if (response.status >= 400) {
          this.onEndSearchingFailed(response.status);
          const error = new Error(`Bad response from server: ${response.status} (request: /api/markAggregates/itemId/...)`);
          error.name = 'ErrorCaught';
          throw (error);
        } else {
          return response.json();
        }
      }).then((jsonResponse) => {
        if (!jsonResponse || jsonResponse.error) {
          this.onEndSearchingFailed('02');
          const error = new Error('fetch OK but returned nothing or an error (request: /api/markAggregates/itemId/...)');
          error.name = 'ErrorCaught';
          throw (error);
        }
        if (!jsonResponse.markAggregates) {
          this.onEndSearchingFailed('03');
          const error = new Error('jsonResponse.markAggregates undefined (request: /api/markAggregates/itemId/...)');
          error.name = 'ErrorCaught';
          throw (error);
        }
        if (jsonResponse.markAggregates.length >= 0) {
          this.setState({ markAggregates: jsonResponse.markAggregates });
          if (jsonResponse.markAggregates.length > 0) this.onEndSearchingOK(jsonResponse.markAggregates.length);
          else this.onEndSearchingNoResults();
        }
      }).catch((error) => {
        if (error.name !== 'ErrorCaught') this.onEndSearchingFailed('04');
        reject(error);
      });
      logSearchItemContainer.warn('} SearchItemContainer.FindMarks');
    });
  }


  render() {
    console.log('Render SearchItemContainer');

    return (
      <div>
        <Container fluid>
          <SearchItemForm
            ref={(r) => { this._childComponent = r; }}
            kinds={this.props.kinds}
            categories={this.props.categories}
            items={this.props.items}
            onSubmit={this.onSubmit.bind(this)}
            resetForm={this.resetForm.bind(this)}
          />

          {this.state.markAggregates &&
            <Row className="mt-1">
              <Table responsive striped>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Overall</th>
                    <th>Food</th>
                    <th>Value</th>
                    <th>Place</th>
                    <th>Staff</th>
                    <th># Reviews</th>
                    <th>Distance</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.markAggregates.map((markAggregate, index) => { return (<ListOneMark markAggregate={markAggregate} index={index} key={markAggregate._id} />); })}
                </tbody>
              </Table>
            </Row>
          }
        </Container>
      </div>
    );
  }
}


/* Old alert system: 

  import { Alert } from 'reactstrap';
  
  in constructor:

    this.state = {
      // alertStatus possible values:
      // -  0: no alerts
      //  - searching alerts:  1: searching, 2: searching OK, 3: no results,
      //                      -1: searching KO, -2: SearchItem error
      alertStatus: 0,
      alertMessage: '',

  onStartSearching = () => {
    this.setState({ alertStatus: 1, alertColor: 'info', alertMessage: 'Searching...' });
    window.scrollTo(0, 0);

  onEndSearchingOK = (nbItems) => {
    const durationSearching = new Date().getTime() - this._nowStartSaving;
    this.setState({ alertStatus: 2, alertColor: 'success', alertMessage: `Searching done! (duration=${durationSearching}ms)` });
    setTimeout(() => { this.setState({ alertStatus: 0 }); }, 3000);

  onEndSearchingNoResults = () => {
    const durationSearching = new Date().getTime() - this._nowStartSaving;
    this.setState({ alertStatus: 3, alertColor: 'warning', alertMessage: `No results found (duration=${durationSearching}ms)` });
  }


  onEndSearchingFailed = (errorMessage) => {
    const durationSearching = new Date().getTime() - this._nowStartSaving;
    this.setState({ alertStatus: -1, alertColor: 'danger', alertMessage: `Error while searching (error=${errorMessage}, duration=${durationSearching}ms)` });

  in Render:
    {this.state.alertStatus !== 0 && <Alert color={this.state.alertColor}>{this.state.alertMessage}</Alert>}
*/


const mapStateToProps = (state) => {
  // Add the All to the Kind & Category lists
  const kinds = [{ id: '--all--', name: 'All' }, ...state.kinds.kinds];
  const categories = [{ id: '--all--', name: 'All' }, ...state.categories.categories];
  return {
    coordinates: state.coordinates,
    kinds,
    categories,
    items: state.items.items,
  };
};

SearchItemContainer = connect(mapStateToProps)(SearchItemContainer);
export default SearchItemContainer;
