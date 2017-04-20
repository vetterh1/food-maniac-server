import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
// import { reduxForm } from 'redux-form';
// import { connect } from 'react-redux';
import { Container } from 'reactstrap';
import SearchItemForm from './SearchItemForm';
// import stringifyOnce from '../../utils/stringifyOnce';

require('es6-promise').polyfill();
require('isomorphic-fetch');

const logSearchItemContainer = log.getLogger('logSearchItemContainer');
logSearchItemContainer.setLevel('debug');
logSearchItemContainer.debug('--> entering SearchItemContainer.jsx');



const ListOneMark = (props) => {
  const { mark } = props;
  return (
    <li>{mark.markOverall}</li>
  );
};

ListOneMark.propTypes = {
  index: PropTypes.number.isRequired,
  mark: PropTypes.object.isRequired,
};




class SearchItemContainer extends React.Component {
  static propTypes = {
  }

  constructor(props) {
    super(props);
    this.values = null;
    this.submitForm = this.submitForm.bind(this);

    this.state = {
      marks: [],
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

      fetch(`/api/marks/itemId/${this.values.item}`)
      .then((response) => {
        logSearchItemContainer.debug('   SearchItemContainer - fetch operation OK');
        return response.json();
      }).then((jsonMarks) => {
        if (jsonMarks && jsonMarks.marks && jsonMarks.marks.length >= 0) {
          this.setState({ marks: jsonMarks.marks });
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
        </Container>

        <div>
          {this.state.marks && this.state.marks.map((mark, index) => { return (<ListOneMark mark={mark} index={index} />); })}
        </div>
      </div>
    );
  }
}




// const mapStateToProps = (state) => { return { places: state.places }; };

// SearchItemContainer = reduxForm({ form: 'SearchItem' })(SearchItemContainer); // DecoSearchItem the form component
// SearchItemContainer = connect(mapStateToProps)(SearchItemContainer);
export default SearchItemContainer;
