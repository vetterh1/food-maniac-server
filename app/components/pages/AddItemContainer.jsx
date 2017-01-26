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

    this.state = {
    };
  }


  submitForm(data) {
    fetch('http://localhost:8085/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item: data }, null, 4),
    })
    .then((response) => {
      console.log('fetch result: ', response);
      if (response.ok) {
        console.log('fetch operation OK');
        return response.blob();
      }
      throw new Error('Network response was not ok.');
    })
    .catch((error) => {
      console.error(`There has been a problem with your fetch operation: ${error.message}`);
    });
  }


  render() {
    return (<AddItem onSubmit={this.submitForm} />);
  }

}

export default AddItemContainer;
