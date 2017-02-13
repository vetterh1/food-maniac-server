import React from 'react';
import ListItems from './ListItems';
import io from 'socket.io-client';

require('es6-promise').polyfill();
require('isomorphic-fetch');

class ListItemsContainer extends React.Component {
  static propTypes = {
    URL: React.PropTypes.string.isRequired,
    socketRoom: React.PropTypes.string,
  }

  constructor() {
    super();
    this.load = this.load.bind(this);
    this._ListItemsComponent = null;

    this.socket = io();

    this.state = {
      items: [],
    };
  }


  componentDidMount() {
    if (this.props.socketRoom) {
      this.socket.emit('join', this.props.socketRoom);
    }
    this.load();
  }

  componentWillUnmount() {
    if (this.props.socketRoom) {
      this.socket.emit('leave', this.props.socketRoom);
    }
  }


  load() {
    this._ListItemsComponent.onStartLoading();

    fetch(this.props.URL)
      .then((response) => {
        console.log('fetch operation OK', response.statusText);
        return response.json();
      }).then((jsonItems) => {
        console.log('parsed json: ', jsonItems);
        this.setState({ items: jsonItems.items });
        this._ListItemsComponent.onEndLoadingOK();
      }).catch((ex) => {
        console.log('parsing failed', ex);
        this._ListItemsComponent.onEndLoadingFailed();
      });
  }


  render() {
    return (<ListItems ref={(r) => { this._ListItemsComponent = r; }} items={this.state.items} />);
  }

}

export default ListItemsContainer;
