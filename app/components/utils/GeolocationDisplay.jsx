import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import MdLocationOn from 'react-icons/lib/md/location-on';
import { connect } from 'react-redux';
import TestDisplayPositionFromStore from './TestDisplayPositionFromStore';


const styles = {

  locationOK: {
    color: 'green',
  },

  locationKO: {
    color: 'red',
  },
};


export class GeolocationDisplay extends React.Component {
  constructor() {
    super();
    this.toggle = this.toggle.bind(this);

    this.state = {
      statisticsOpen: false,
    };
  }

  toggle() {
    this.setState({ statisticsOpen: !this.state.statisticsOpen });
  }

  render = () => {
    return (
      <div>
        <Button onClick={this.toggle} size="md" color="link" style={this.props.coordinates.real ? styles.locationOK : styles.locationKO}>
          <MdLocationOn size={18} />
        </Button>
        <Modal isOpen={this.state.statisticsOpen} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Geolocation Statistics</ModalHeader>
          <ModalBody>
            <div className="geolocation_statistics">
              Coordinates:
              <ul>
                <li>Latitude: {this.props.coordinates.latitude ? Math.round(this.props.coordinates.latitude * 100000) / 100000 : 'unknown'}</li>
                <li>Longitude: {this.props.coordinates.longitude ? Math.round(this.props.coordinates.longitude * 100000) / 100000 : 'unknown'}</li>
                <li>Real: {this.props.coordinates.real ? 'true' : 'false'}</li>
                <li>Changed: {this.props.coordinates.changed ? 'true' : 'false'}</li>
                <li>Changed (real): {this.props.coordinates.changedReal ? 'true' : 'false'}</li>
              </ul>
            </div>

            <div className="geolocation_statistics">
              Statistics:
              <ul>
                <li>Nb refreshes: {this.props.coordinates.nbRefreshes}</li>
                <li>Nb different positions: {this.props.coordinates.nbDiffs}</li>
                <li>Nb real positions: {this.props.coordinates.nbReal}</li>
                <li>Nb estimated positions: {this.props.coordinates.nbEstimated}</li>
                <li>Nb closed positions: {this.props.coordinates.nbClose}</li>
              </ul>
            </div>

            <div className="geolocation_statistics">
              Simulation:
              <TestDisplayPositionFromStore onClick={this.toggle} />
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }

}



GeolocationDisplay.propTypes = {
  coordinates: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      real: PropTypes.boolean,
      changed: PropTypes.boolean,
      changedReal: PropTypes.boolean,
      nbRefreshes: PropTypes.number,
      nbDiffs: PropTypes.number,
      nbReal: PropTypes.number,
      nbEstimated: PropTypes.number,
      nbClose: PropTypes.number,
    }).isRequired,
};


// 1st to receive store changes
// Role of mapStateToProps: transform the "interesting" part of the store state
// into some props that will be received by componentWillReceiveProps
const mapStateToProps = (state) => { return { coordinates: state.coordinates }; };


export default connect(mapStateToProps)(GeolocationDisplay); // eslint-disable-line no-class-assign
