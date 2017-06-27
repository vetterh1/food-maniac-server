import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import * as CoordinatesActions from '../../actions/CoordinatesActions';

export class TestDisplayPositionFromStore extends React.Component {
  // Save in Redux store the fake locations
  dispatchAction = (latitude, longitude) => {
    const { dispatch } = this.props;  // Injected by react-redux
    const action = CoordinatesActions.setCurrentLocation(latitude, longitude, false);
    dispatch(action);
  };

  // Save in Redux store the simulated location
  dispatchSetSimulatedAction = (latitude, longitude) => {
    const { dispatch } = this.props;  // Injected by react-redux
    const action = CoordinatesActions.setSimulatedMode(latitude, longitude);
    dispatch(action);
  };

  // Tell Redux store to stop the simulated location
  dispatchStopSimulatedAction = () => {
    const { dispatch } = this.props;  // Injected by react-redux
    const action = CoordinatesActions.stopSimulatedMode();
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

  clickMoab = (e) => {
    e.preventDefault();
    this.dispatchAction(38.5743966, -109.5689281);
    this.props.onClick();
  };



  clickSimulatedLille = (e) => {
    e.preventDefault();
    this.dispatchSetSimulatedAction(50.6405856, 3.064508);
    this.props.onClick();
  };


  clickSimulatedMoab = (e) => {
    e.preventDefault();
    this.dispatchSetSimulatedAction(38.5743966, -109.5689281);
    this.props.onClick();
  };


  clickSimulatedLasVegas = (e) => {
    e.preventDefault();
    this.dispatchSetSimulatedAction(36.0839998, -115.1559276);
    this.props.onClick();
  };


  clickStopSimulated = (e) => {
    e.preventDefault();
    this.dispatchStopSimulatedAction();
    this.props.onClick();
  };



  render = () => {
    return (
      <div>
        <ul>
          <li><Button onClick={this.clickRandom}>Random</Button></li>
          <li><Button onClick={this.clickStrasbourg}>Strasbourg</Button></li>
          <li><Button onClick={this.clickLille}>Lille</Button></li>
          <li><Button onClick={this.clickMoab}>Moab</Button></li>
          <li><Button onClick={this.clickSimulatedLille}>Lille (simulated)</Button></li>
          <li><Button onClick={this.clickSimulatedMoab}>Moab (simulated)</Button></li>
          <li><Button onClick={this.clickSimulatedLasVegas}>LasVegas (simulated)</Button></li>
          <li><Button onClick={this.clickStopSimulated}>Stop simulated mode)</Button></li>
        </ul>
      </div>
    );
  }
}

TestDisplayPositionFromStore.propTypes = {
  onClick: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect()(TestDisplayPositionFromStore);
