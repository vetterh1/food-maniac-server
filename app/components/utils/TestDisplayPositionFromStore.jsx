import React from 'react';
import { connect } from 'react-redux';
import * as LocationActions from '../../actions/LocationActions';
import { Button } from 'reactstrap';

class TestDisplayPositionFromStore extends React.Component {
  static propTypes = {
    onClick: React.PropTypes.func.isRequired,
  }
  dispatchAction = (latitude, longitude) => {
    const { dispatch } = this.props;  // Injected by react-redux
    const action = LocationActions.setCurrentLocation(latitude, longitude, false);
    dispatch(action);
  };

  clickRandom = (e) => {
    e.preventDefault();
    this.dispatchAction(Math.floor(Math.random() * 180) - 90, Math.floor(Math.random() * 180) - 90);
    this.props.onClick();
  };

  clickStrasbourg = (e) => {
    e.preventDefault();
    this.dispatchAction(48.5876, 7.7408);
    this.props.onClick();
  };

  clickLille = (e) => {
    e.preventDefault();
    this.dispatchAction(50.6405856, 3.064508);
    this.props.onClick();
  };

  render = () => {
    return (
      <div>
        <ul>
          <li><Button onClick={this.clickRandom}>Random</Button></li>
          <li><Button onClick={this.clickStrasbourg}>Strasbourg</Button></li>
          <li><Button onClick={this.clickLille}>Lille</Button></li>
        </ul>
      </div>
    );
  }
}

export default connect()(TestDisplayPositionFromStore);
