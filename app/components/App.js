import React from 'react';
import Geolocation from './Geolocation';
import DisplayPositionFromStore from '../tests/DisplayPositionFromStore.jsx';
import PlacesContainer from '../containers/PlacesContainer.jsx';
import Version from "./Version";

const _version = "0.16-new_map_component";

const App = (props) => <div>
                         <h1>Map Test</h1>
                         <Geolocation />
                         <DisplayPositionFromStore />
                         <PlacesContainer />
                         { props.children }
                         <Version version={_version}/>
                       </div>;

export default App;
