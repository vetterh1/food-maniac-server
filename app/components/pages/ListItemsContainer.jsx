import React from 'react';
import ListItems from './ListItems';

require('es6-promise').polyfill();
require('isomorphic-fetch');

class ListItemsContainer extends React.Component {
  static propTypes = {
  }

  constructor() {
    super();
    this.load = this.load.bind(this);
    this._ListItemsComponent = null;

    this.state = {
      items: [],
    };
  }


  componentDidMount() {
    this.load();
  }

  load() {
    this._ListItemsComponent.onStartLoading();




    fetch('/api/items')
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
