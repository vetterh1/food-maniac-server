/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SimpleListOrDropdown from './SimpleListOrDropdown';


class ListItemsContainer extends React.Component {
  static propTypes = {
    // Display a simple dropdown instead of a list
    dropdown: PropTypes.bool,
    // Injected by redux-store connect:
    items: PropTypes.array.isRequired,
  };

  render() {
    if (!this.props.items) return null;
    return <SimpleListOrDropdown items={this.props.items} dropdown={this.props.dropdown} />;
  }
}

ListItemsContainer.defaultProps = { dropdown: true, items: [] };

const mapStateToProps = (state) => { return { items: state.items.items }; };

export default connect(mapStateToProps)(ListItemsContainer);
