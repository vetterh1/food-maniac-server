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
    return <SimpleListOrDropdown items={this.state.items} dropdown={this.props.dropdown} />;
  }
}

ListItemsContainer.defaultProps = { dropdown: true, items: [] };




const getVisibleItems = (items, kind, category) => {
  return items.filter((item) => {
    const kindCondition = (kind && kind !== undefined && kind !== '--all--' ? item.kind === kind : true);
    const categoryCondition = (category && category !== undefined && category !== '--all--' ? item.category === category : true);
    return kindCondition && categoryCondition;
  });
};

const mapStateToProps = (state) => {
  const kind = state.form && state.form.SearchItemForm && state.form.SearchItemForm.values ? state.form.SearchItemForm.values.kind : null;
  const category = state.form && state.form.SearchItemForm && state.form.SearchItemForm.values ? state.form.SearchItemForm.values.category : null;
  return {
    items: getVisibleItems(
      state.items.items,
      kind,
      category,
    ),
  };
};

export default connect(mapStateToProps)(ListItemsContainer);
