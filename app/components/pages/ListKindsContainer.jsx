/* eslint-disable react/forbid-prop-kinds */

import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
import ListKinds from './ListKinds';

const logListKindsContainer = log.getLogger('logListKindsContainer');
logListKindsContainer.setLevel('debug');
logListKindsContainer.debug('--> entering ListKindsContainer.jsx');

require('es6-promise').polyfill();
require('isomorphic-fetch');



class ListKindsContainer extends React.Component {
  static propTypes = {
    // Display a simple dropdown instead of a list
    dropdown: PropTypes.bool,
    // Query filter as a json formated string. Ex: '{"category":"dish"}' <-- category is a wrong ex!!!
    filter: PropTypes.string,
    // Callback function to display errors
    onListKindsError: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.load = this.load.bind(this);

    this.state = {
      kinds: [],
    };
  }

  componentDidMount() {
    this.load();
  }

  onLocalListKindsError(message) {
    console.error('ListKindsContainer error: ', message);
  }

  load() {
    logListKindsContainer.debug('ListKindsContainer - load');
    fetch('/api/kinds')
      .then((response) => {
        if (response.status >= 400) {
          this.props.onListKindsError(response.status);
          const error = new Error(`Bad response from server: ${response.status} (request: /api/kinds)`);
          error.name = 'ErrorCaught';
          throw error;
        }
        return response.json();
      }).then((jsonTypes) => {
        if (jsonTypes && jsonTypes.kinds && jsonTypes.kinds.length >= 0) this.setState({ kinds: jsonTypes.kinds });
        else this.props.onListKindsError('20');
      }).catch((error) => {
        if (error.name !== 'ErrorCaught') this.props.onListKindsError('24');
        logListKindsContainer.error(error.message);
      });
  }


  render() {
    if (!this.state.kinds) return null;

    return (
      <div>
        <ListKinds kinds={this.state.kinds} dropdown={this.props.dropdown} />
      </div>
    );
  }

}

ListKindsContainer.defaultProps = {
  dropdown: true,
  filter: '{}',
  onListKindsError: ListKindsContainer.prototype.onLocalListKindsError,
};


export default ListKindsContainer;
