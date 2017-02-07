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
      }).then((json) => {
        console.log('parsed json', json);
      }).catch((ex) => {
        console.log('parsing failed', ex);
      });

 /*

    fetch('/api/items')
      .then(function(response) {
        return response.json()
      }).then(function(json) {
        console.log('parsed json', json)
      }).catch(function(ex) {
        console.log('parsing failed', ex)
      });

    fetch('/api/items', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      console.log('fetch result: ', response);
      if (response.ok) {
        this._ListItemsComponent.onEndLoadingOK();
        console.log('fetch operation OK');
        return response.blob();
      }
      this._ListItemsComponent.onEndLoadingFailed('01');
      throw new Error('Network response was not ok.');
    })
    .then((items) => {
        console.log('items: ', items);
    })
    .catch((error) => {
      this._ListItemsComponent.onEndLoadingFailed('02');
      console.error(`There has been a problem with your fetch operation: ${error.message}`);
    });
    */
  }


  render() {
    return (<ListItems ref={(r) => { this._ListItemsComponent = r; }} />);
  }

}

export default ListItemsContainer;
