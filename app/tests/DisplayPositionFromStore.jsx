import React from 'react';
import { connect } from 'react-redux';


const DisplayPositionFromStore = React.createClass({
	render: function () {
		return (
			<div>
				DisplayPositionFromStore test ==> lat: {this.props.position.lat} - lng: {this.props.position.lng}
			</div>
		);
	}	
});

const mapStateToProps = (state) => {
  console.log("{   DisplayPositionFromStore.mapStateToProps (dpms)" );
  console.log("       (dpms) state:", state);
  let result = {
    position: { lat: state.coordinates.latitude, lng: state.coordinates.longitude }
  }
  console.log("       (dpms) result:", result);
  console.log("}   DisplayPositionFromStore.mapStateToProps" );
  return result;
}

export default connect(mapStateToProps)(DisplayPositionFromStore);
