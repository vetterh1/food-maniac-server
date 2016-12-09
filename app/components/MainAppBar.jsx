import Radium from 'radium';
import React from 'react';
import AppBar from 'material-ui/AppBar';


@Radium
class MainAppBar extends React.Component {
  render() {
    return (
      <AppBar
        title="Food Maniac!"
        iconClassNameRight="muidocs-icon-navigation-expand-more"
      />
    );
  }
}

export default MainAppBar;
