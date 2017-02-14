import React from 'react';
import ListItems from './ListItems';
import io from 'socket.io-client';

require('es6-promise').polyfill();
require('isomorphic-fetch');

class ListItemsContainer extends React.Component {
  static propTypes = {
    URL: React.PropTypes.string.isRequired,
    socketName: React.PropTypes.string,
  }

  constructor() {
    super();
    this.load = this.load.bind(this);
    this.updateServerStateById = this.updateServerStateById.bind(this);
    this._ListItemsComponent = null;

    this.state = {
      items: [],
    };
  }

  componentDidMount() {
    if (this.props.socketName) {
      console.log(`ListItemsContainer.componentDidMount connects to ${this.props.socketName}`);
      this.socket = io();
      this.socket.on(`${this.props.socketName}.OK`, (itemId) => {
        this.updateServerStateById(itemId, 'OK');
      });

      this.socket.on(`${this.props.socketName}.KO`, (itemId) => {
        this.updateServerStateById(itemId, 'KO');
      });

      this.socket.on(`${this.props.socketName}.done`, () => {
        
      });
    }

    this.load();
  }

  componentWillUnmount() {
  }


  updateServerStateById(itemId, value) {
    let found = false;
    const newItems = this.state.items.map((item) => {
      if (item._id === itemId) {
        found = true;
        return { ...item, serverState: value };
      }
      return item;
    });
    if (!found) {
      newItems.push({ name: itemId, _id: itemId, serverState: value });
      console.log('added new item: ', itemId);
    }
    this.setState({ items: newItems });
  }



  load() {
    this._ListItemsComponent.onStartLoading();

    fetch(this.props.URL)
      .then((response) => {
        console.log('ListItemsContainer - fetch operation OK');
        return response.json();
      }).then((jsonItems) => {
        // console.log('parsed json: ', jsonItems);
        if (jsonItems && jsonItems.items && jsonItems.items.length > 0) {
          this.setState({ items: jsonItems.items });
          this._ListItemsComponent.onEndLoadingOK();
        }
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
