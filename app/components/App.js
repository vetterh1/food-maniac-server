import React from 'react';
import Geolocation from './Geolocation';
import Version from "./Version";

const _version = "0.08";

const App = (props) => <div>
                         <h1>Map Test</h1>
                         <Geolocation />
                         { props.children }
                         <Version version={_version}/>
                       </div>;

export default App;
