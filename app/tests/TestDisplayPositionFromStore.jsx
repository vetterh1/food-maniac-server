import React from 'react';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import * as LocationActions from '../actions/LocationActions';

class TestDisplayPositionFromStore extends React.Component {

  handleTouchTap = () => {
    const { dispatch } = this.props;  // Injected by react-redux
    const action = LocationActions.setCurrentLocation(Math.floor(Math.random() * 180) - 90, Math.floor(Math.random() * 180) - 90, false);
    dispatch(action);
  };

  render = () => {
    return (
      <div>
        <FlatButton
          label="Random Pos"
          onTouchTap={this.handleTouchTap}
        />
      </div>
    );
  }
}

export default connect()(TestDisplayPositionFromStore);
