import React from 'react';
import Geolocation from './Geolocation';


const App = (props) => <div>
                         <h1>Map Test</h1>
                         <Geolocation />
                         { props.children }
                       </div>;

export default App;