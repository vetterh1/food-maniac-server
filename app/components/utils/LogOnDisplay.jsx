/* eslint-disable react/no-multi-comp */
/* eslint-disable react/prop-types */

import React from 'react';

const divStyle = {
  color: 'grey',
  fontSize: '0.5rem',
  padding: '1em 1em',
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
      <div style={divStyle}>
        <ul>
          {this.state.list.map((line, index) => (<li key={index}>{line}</li>))}
        </ul>
      </div>
    );
  }
}

export default LogOnDisplay;
