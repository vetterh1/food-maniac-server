/* eslint-disable react/forbid-prop-types */

import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';
import Alert from 'react-s-alert';
import 'isomorphic-fetch';
import { polyfill } from 'es6-promise';
import MdStarHalf from 'react-icons/lib/md/star-half';
import SearchItemForm from './SearchItemForm';
import ListOneMarkContainer from './ListOneMarkContainer';
import SimulateLocationContainer from '../pages/SimulateLocationContainer';

const logSearchItemContainer = log.getLogger('logSearchItemContainer');
logSearchItemContainer.setLevel('debug');
logSearchItemContainer.debug('--> entering SearchItemContainer.jsx');


class SearchItemContainer extends React.Component {
  static propTypes = {
    // Injected by redux-store connect:
    coordinates: PropTypes.object.isRequired,
    kinds: PropTypes.object.isRequired,
    categories: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
    this.values = null;

    this._childComponent = null;

    this.state = {
      markAggregates: null, // Results
      modalSimulateLocation: false,
      googleMapId: null,
      distance: 0,
    };

    this.alert = null;
  }



  onStartSearching = () => {
    this._nowStartSaving = new Date().getTime();
    this.alert = Alert.info('Searching...');
  }

  onEndSearchingOK = (nbItems) => {
    const durationSearching = new Date().getTime() - this._nowStartSaving;
    if (this.alert) Alert.update(this.alert, `${nbItems} item(s) found! (duration=${durationSearching}ms)`, 'success');
    else this.alert = Alert.success(`${nbItems} item(s) found! (duration=${durationSearching}ms)`);
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


  onRequestSimulateLocation() {
    this.setState({ modalSimulateLocation: true });
  }

  onCloseModalSimulateLocation() {
    this.setState({ modalSimulateLocation: false });
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
            onRequestSimulateLocation={this.onRequestSimulateLocation.bind(this)}
          />

          {this.state.markAggregates &&
            <div className="standard-container mt-5">
              <h5 className="mb-4"><MdStarHalf size={24} className="mr-2" /> Results:</h5>
              {this.state.markAggregates.map((markAggregate) => {
                return (<ListOneMarkContainer
                  markAggregate={markAggregate}
                  key={markAggregate._id}
                />);
              })
              }
            </div>
          }
          <SimulateLocationContainer
            open={this.state.modalSimulateLocation}
            onClose={this.onCloseModalSimulateLocation.bind(this)}
          />
        </Container>
      </div>
    );
  }
}

/* Old display in table

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



const ListOneMark = (props) => {
  const { markAggregate } = props;
  // sanitizeHtml escapes &<>" so we need to invert this for display!
  const name = markAggregate.place.name.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');

  return (
    <tr>
      <th scope="row">{name}</th>
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

*/



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
  return {
    coordinates: state.coordinates,
    kinds: state.kinds,
    categories: state.categories,
    items: state.items.items,
  };
};

export default connect(mapStateToProps)(SearchItemContainer);
