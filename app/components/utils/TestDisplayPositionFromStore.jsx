/* eslint-disable react/prop-types */

import React from 'react';
import { connect } from 'react-redux';
import * as LocationActions from '../../actions/LocationActions';

class TestDisplayPositionFromStore extends React.Component {

  dispatchAction = (latitude, longitude) => {
    const { dispatch } = this.props;  // Injected by react-redux
    const action = LocationActions.setCurrentLocation(latitude, longitude, false);
    dispatch(action);
  };

  clickRandom = (e) => {
    e.preventDefault();
    this.dispatchAction(Math.floor(Math.random() * 180) - 90, Math.floor(Math.random() * 180) - 90);
  };

  clickStrasbourg = (e) => {
    e.preventDefault();
    this.dispatchAction(48.5876, 7.7408);
  };

  clickLille = (e) => {
    e.preventDefault();
    this.dispatchAction(50.6405856, 3.064508);
  };

  render = () => {
    return (
      <div>
        <ul>
          <li><button onClick={this.clickRandom}>Random</button></li>
          <li><button onClick={this.clickStrasbourg}>Strasbourg</button></li>
          <li><button onClick={this.clickLille}>Lille</button></li>
        </ul>
      </div>
    );
  }
}

export default connect()(TestDisplayPositionFromStore);
