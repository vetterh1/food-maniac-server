/* eslint-disable react/no-multi-comp */
/* eslint-disable react/prop-types */

import React from 'react';


const styles = {
  Popover: {
    padding: '1em',
  },

  locationOK: {
    color: 'green',
  },

  locationKO: {
    color: 'red',
  },

  statistics: {
    color: 'grey',
    marginTop: 40,
  },
};


class LogOnDisplay extends React.Component {
  static propTypes = {
  }

  constructor() {
    super();
    this.handleTouchTap = this.handleTouchTap.bind(this);

    this.state = {
      open: false,
      list: [],
    };
  }


  addLog = (text) => {
    this.setState(state => ({ list: [...state.list, text] }));
  }


  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  render = () => {
    return (
      <div>
        <ul>
          {this.state.list.map((line, index) => (<li key={index}>{line}</li>))}
        </ul>
      </div>
    );
  }
}

export default LogOnDisplay;
