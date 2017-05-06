/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ListKinds from './ListKinds';


//
// Display a list of Kinds stored in redux store
//

class ListKindsContainer extends React.Component {
  static propTypes = {
    // Display a simple dropdown instead of a list
    dropdown: PropTypes.bool,
    // Injected by redux-store connect:
    kinds: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { kinds: props.kinds };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps) return;
    if (!nextProps.kinds) return;
    this.setState({ kinds: nextProps.kinds });
  }

  render() {
    if (!this.state.kinds) return null;
    return <ListKinds kinds={this.state.kinds} dropdown={this.props.dropdown} />;
  }
}

ListKindsContainer.defaultProps = { dropdown: true, kinds: [] };

const mapStateToProps = (state) => {
  // Add the All to the list <-- should NOT be done in all forms :-S
  // const kinds = [{ _id: '--all--', name: 'All' }, ...state.kinds.kinds];
  // return { kinds };
  return { kinds: state.kinds.kinds };
};

export default connect(mapStateToProps)(ListKindsContainer);
