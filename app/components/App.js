import React from 'react';
import NavLink from './NavLink';
import Geolocation from './Geolocation';

/*export default React.createClass({
  render() {
    return (
      <div>
        <h1>React Router Tutorial</h1>
        <ul role="nav">
          <li><NavLink to="/about">About</NavLink></li>
          <li><NavLink to="/repos">Repos</NavLink></li>
        </ul>
        {this.props.children}
      </div>
    )
  }
})
*/
const Nav = () => <ul role="nav">
                    <li>
                      <NavLink to="/about">About</NavLink>
                    </li>
                    <li>
                      <NavLink to="/repos">Repos</NavLink>
                    </li>
                  </ul>;


const App = (props) => <div>
                         <h1>React Router Tutorial</h1>
                         <Nav />
                         <Geolocation />
                         { props.children }
                       </div>;

export default App;