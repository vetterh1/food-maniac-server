import React from 'react';
import Geolocation from './Geolocation';
import MapContainer from '../containers/basic.jsx';
import Version from "./Version";

const _version = "0.14-new-map-branch";

const App = (props) => <div>
                         <h1>Map Test</h1>
                         <Geolocation />
                         <MapContainer />
                         { props.children }
                         <Version version={_version}/>
                       </div>;

export default App;
