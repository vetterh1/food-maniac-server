/* eslint-disable react/prefer-stateless-function */

import Radium from 'radium';
import React from 'react';
import AppBar from 'material-ui/AppBar';
import { browserHistory } from 'react-router';


const styles = {
  title: {
    cursor: 'pointer',
  },
};

@Radium
class MainAppBar extends React.Component {
  constructor() {
    super();
    this._handleClick = this._handleClick.bind(this);
  }

  _handleClick() {
    browserHistory.push('/');
  }

  render() {
    return (
      <AppBar
        title={<span style={styles.title}>Food Maniac</span>}
        iconClassNameRight="muidocs-icon-navigation-expand-more"
        onTitleTouchTap={this._handleClick}
      />
    );
  }
}

export default MainAppBar;
