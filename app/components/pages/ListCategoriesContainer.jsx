/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ListCategories from './ListCategories';


class ListCategoriesContainer extends React.Component {
  static propTypes = {
    // Display a simple dropdown instead of a list
    dropdown: PropTypes.bool,
    // Injected by redux-store connect:
    categories: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = { categories: props.categories };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps) return;
    if (!nextProps.categories) return;
    this.setState({ categories: nextProps.categories });
  }

  render() {
    if (!this.state.categories) return null;
    return <ListCategories categories={this.state.categories} dropdown={this.props.dropdown} />;
  }
}

ListCategoriesContainer.defaultProps = { dropdown: true, categories: [] };

const mapStateToProps = (state) => {
  // Add the All to the list <-- should NOT be done in all forms :-S
  const categories = [{ _id: '--all--', name: 'All' }, ...state.categories.categories];
  return { categories };
};

export default connect(mapStateToProps)(ListCategoriesContainer);
