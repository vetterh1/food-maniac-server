import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
// import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { Container, Row, Table } from 'reactstrap';
import SearchItemForm from './SearchItemForm';
import stringifyOnce from '../../utils/stringifyOnce';

require('es6-promise').polyfill();
require('isomorphic-fetch');

const logSearchItemContainer = log.getLogger('logSearchItemContainer');
logSearchItemContainer.setLevel('debug');
logSearchItemContainer.debug('--> entering SearchItemContainer.jsx');



const ListOneMark = (props) => {
  const { markAggregate } = props;
  return (
    <tr>
      <th scope="row">{markAggregate.place.name}</th>
      <td>{markAggregate.markOverall}</td>
      <td>{markAggregate.markFood}</td>
      <td>{markAggregate.markPlace}</td>
      <td>{markAggregate.markStaff}</td>
      <td>{markAggregate.nbMarksOverall}</td>
    </tr>
  );
};

ListOneMark.propTypes = {
  index: PropTypes.number.isRequired,
  markAggregate: PropTypes.object.isRequired,
};




class SearchItemContainer extends React.Component {
  static propTypes = {
    coordinates: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.values = null;
    this.submitForm = this.submitForm.bind(this);

    this.state = {
      markAggregates: [],
    };
  }


  submitForm(values) {
    this.values = values;
    this.FindMarks();
  }


  FindMarks() {
    // Return a new promise.
    return new Promise((resolve, reject) => {
      logSearchItemContainer.debug('{ SearchItemContainer.FindMarks');
      logSearchItemContainer.debug(`SearchItemContainer.FindMarks - this.props.coordinates:\n\n${stringifyOnce(this.props.coordinates, null, 2)}`);
      logSearchItemContainer.debug(`SearchItemContainer.FindMarks - this.props.coordinates.latitude:\n\n${stringifyOnce(this.props.coordinates.latitude, null, 2)}`);

      fetch(`/api/markAggregates/itemId/${this.values.item}/maxDistance/${this.values.searchDistance}/lat/${this.props.coordinates.latitude}/lng/${this.props.coordinates.longitude}`)
      .then((response) => {
        logSearchItemContainer.debug('   SearchItemContainer - fetch operation OK');
        return response.json();
      }).then((jsonMarks) => {
        if (jsonMarks && jsonMarks.markAggregates && jsonMarks.markAggregates.length >= 0) {
          this.setState({ markAggregates: jsonMarks.markAggregates });
        }
        if (jsonMarks && jsonMarks.error) {
          logSearchItemContainer.debug('   SearchItemContainer - fetch OK but returned an error');
          // this._ListItemsComponent.onEndLoadingFailed(jsonMarks.error);
        }
      }).catch((ex) => {
        logSearchItemContainer.error('   parsing failed', ex);
        // this._ListItemsComponent.onEndLoadingFailed(ex);
      });
      logSearchItemContainer.debug('} SearchItemContainer.FindMarks');
    });
  }


  render() {
    return (
      <div>
        <Container fluid>
          <SearchItemForm onSubmit={this.submitForm} />

          <Row>
            <Table responsive striped>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Overall</th>
                  <th>Food</th>
                  <th>Place</th>
                  <th>Staff</th>
                  <th># Reviews</th>
                </tr>
              </thead>
              <tbody>
                {this.state.markAggregates && this.state.markAggregates.map((markAggregate, index) => { return (<ListOneMark markAggregate={markAggregate} index={index} key={markAggregate._id} />); })}
              </tbody>
            </Table>
          </Row>
        </Container>
      </div>
    );
  }
}




const mapStateToProps = (state) => { return { coordinates: state.coordinates }; };

// SearchItemContainer = reduxForm({ form: 'SearchItem' })(SearchItemContainer); // DecoSearchItem the form component
SearchItemContainer = connect(mapStateToProps)(SearchItemContainer);
export default SearchItemContainer;
