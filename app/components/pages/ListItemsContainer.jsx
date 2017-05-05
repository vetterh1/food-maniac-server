/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ListItems from './ListItems';


class ListItemsContainer extends React.Component {
  static propTypes = {
    // Display a simple dropdown instead of a list
    dropdown: PropTypes.bool,
    // Injected by redux-store connect:
    items: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { items: props.items };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps) return;
    if (!nextProps.items) return;
    this.setState({ items: nextProps.items });
  }

  render() {
    if (!this.state.items) return null;
    return <ListItems items={this.state.items} dropdown={this.props.dropdown} />;
  }
}

ListItemsContainer.defaultProps = { dropdown: true, items: [] };

const mapStateToProps = (state) => { return { items: state.items.items }; };
export default connect(mapStateToProps)(ListItemsContainer);
