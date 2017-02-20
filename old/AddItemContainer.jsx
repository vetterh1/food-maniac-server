import React from 'react';
import AddItem from './AddItem';

require('es6-promise').polyfill();
require('isomorphic-fetch');

class AddItemContainer extends React.Component {
  static propTypes = {
  }

  constructor() {
    super();
    this.submitForm = this.submitForm.bind(this);
    this._addItemComponent = null;

    this.state = {
    };
  }


  submitForm(data) {
    this._addItemComponent.onStartSaving();


    fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item: data }, null, 4),
    })
    .then((response) => {
      console.log('fetch result: ', response);
      if (response.ok) {
        this._addItemComponent.onEndSavingOK();
        console.log('fetch operation OK');
        return response.blob();
      }
      this._addItemComponent.onEndSavingFailed('01');
      throw new Error('Network response was not ok.');
    })
    .catch((error) => {
      this._addItemComponent.onEndSavingFailed('02');
      console.error(`There has been a problem with your fetch operation: ${error.message}`);
    });
  }


  render() {
    return (<AddItem ref={(r) => { this._addItemComponent = r; }} onSubmit={this.submitForm} />);
  }

}

export default AddItemContainer;
