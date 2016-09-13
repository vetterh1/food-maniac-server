import React from 'react';
import { connect } from 'react-redux';


const DisplayPositionFromStore = React.createClass({
	render: function () {
		return (
			<div>
				DisplayPositionFromStore test ==> latitude: {this.props.coordinates.latitude} - longitude: {this.props.coordinates.longitude} (real: {this.props.coordinates.real===true?"yes":"no"}, changed: {this.props.coordinates.changed===true?"yes":"no"})
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
