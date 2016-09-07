import React, {PropTypes, Component} from 'react';
// import shouldPureComponentUpdate from 'react-pure-render/function';

import GoogleMap from 'google-map-react';
// import MyGreatPlace from './my_great_place.jsx';


class MapContainer extends Component {

  //shouldComponentUpdate = shouldPureComponentUpdate;

  constructor(props) {
    super(props);
  }

  render() {
	return (
		<GoogleMap
			bootstrapURLKeys={{
				key: "AIzaSyAPbswfvaojeQVe9eE-0CtZ4iEtWia9KO0"
			}}
	        defaultCenter={this.props.center}
        	defaultZoom={this.props.zoom}>
		</GoogleMap>
	);
  }
}

MapContainer.defaultProps={
    center: {lat: 59.938043, lng: 30.337157},
    zoom: 9,
    greatPlaceCoords: {lat: 59.724465, lng: 30.080121}
  };
export default MapContainer;

//        <MyGreatPlace lat={59.955413} lng={30.337844} text={'A'} /* Kreyser Avrora */ />
//        <MyGreatPlace {...this.props.greatPlaceCoords} text={'B'} /* road circle */ />
