import React from 'react';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import * as LocationActions from '../actions/LocationActions';


const styles = {
  div: {
    color: 'grey',
    fontSize: '0.5em',
  },
    button: {
    color: 'grey',
    fontSize: '0.5em',
  },
};


const DisplayPositionFromStore = React.createClass({

  getInitialState: function() {
    return {
      nbChanges: 0
    }
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      nbChanges: this.state.nbChanges + 1
    });
  },

  handleTouchTap: function(event) {
    const { dispatch } = this.props;  // Injected by react-redux
    const action = LocationActions.setCurrentLocation(1, 1, true);
    dispatch(action);
  },

	render: function () {
		return (
			<div style={styles.div}>
        DisplayPositionFromStore test ==> latitude: {this.props.coordinates.latitude} - longitude: {this.props.coordinates.longitude} (real: {this.props.coordinates.real===true?"yes":"no"}, changed: {this.props.coordinates.changed===true?"yes":"no"} - state nb changes: {this.state.nbChanges})
        <FlatButton
          label="Random Pos"
          style={styles.button}
          onTouchTap={this.handleTouchTap}
        />        
			</div>
		);
	}	
});

const mapStateToProps = (state) => {
  console.log("{   DisplayPositionFromStore.mapStateToProps (dpms)" );
  console.log("       (dpms) state:", state);
  
  let result = {
    coordinates: state.coordinates
  }
  console.log("       (dpms) result:", result);
  console.log("}   DisplayPositionFromStore.mapStateToProps" );
  return result;
}

export default connect(mapStateToProps)(DisplayPositionFromStore);
