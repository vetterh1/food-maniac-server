import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
import ListCategories from './ListCategories';

const logListCategoriesContainer = log.getLogger('logListCategoriesContainer');
logListCategoriesContainer.setLevel('debug');
logListCategoriesContainer.debug('--> entering ListCategoriesContainer.jsx');

require('es6-promise').polyfill();
require('isomorphic-fetch');



class ListCategoriesContainer extends React.Component {
  static propTypes = {
    // Display a simple dropdown instead of a list
    dropdown: PropTypes.bool,
    // Callback function to display errors
    onListCategoriesError: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.load = this.load.bind(this);

    this.state = {
      categories: [],
    };
  }

  componentDidMount() {
    this.load();
  }

  onLocalListCategoriesError(message) {
    console.error('ListCategoriesContainer error: ', message);
  }


  load() {
    logListCategoriesContainer.debug('ListCategoriesContainer - load');
    fetch('/api/categories')
      .then((response) => {
        if (response.status >= 400) {
          this.props.onListCategoriesError(response.status);
          const error = new Error(`Bad response from server: ${response.status} (request: /api/categories)`);
          error.name = 'ErrorCaught';
          throw error;
        }
        return response.json();
      }).then((jsonCategories) => {
        if (jsonCategories && jsonCategories.categories && jsonCategories.categories.length >= 0) this.setState({ categories: jsonCategories.categories });
        else this.props.onListCategoriesError('30');
      }).catch((error) => {
        if (error.name !== 'ErrorCaught') this.props.onListCategoriesError('34');
        logListCategoriesContainer.error(error.message);
      });
  }

  render() {
    if (!this.state.categories) return null;

    return (
      <div>
        <ListCategories categories={this.state.categories} dropdown={this.props.dropdown} />
      </div>
    );
  }

}

ListCategoriesContainer.defaultProps = {
  dropdown: true,
  onListCategoriesError: ListCategoriesContainer.prototype.onLocalListCategoriesError,
};

export default ListCategoriesContainer;
