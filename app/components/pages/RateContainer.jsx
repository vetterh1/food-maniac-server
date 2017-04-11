import React from 'react';
import { reduxForm } from 'redux-form';
import { Container } from 'reactstrap';
import RateForm from './RateForm';
import stringifyOnce from '../../utils/stringifyOnce';

require('es6-promise').polyfill();
require('isomorphic-fetch');

class RateContainer extends React.Component {
  static propTypes = {
  }


  constructor(props) {
    super(props);
    this.values = null;
    this.submitForm = this.submitForm.bind(this);
  }

  submitForm(values) {
    this.values = values;
    this.save();
  }


  save() {
    console.log(`RateContainer.save - values:\n\n${stringifyOnce(this.values, null, 2)}`);
    this.saveLocation()
    .then(this.saveMarks.bind(this))
    .then(this.saveDone.bind(this))
    .catch((error) => {
      console.log('RateContainer.save : error catched=', error);
    });
  }

  saveLocation() {
    // Return a new promise.
    return new Promise((resolve, reject) => {
      console.log('{ RateContainer.saveLocation');

      const place = { googleMapId: this.values.location, name: `name-${this.values.location}` };

      fetch('/api/places/addOrUpdatePlaceByGoogleMapId', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ place }),
      })
      .then((response) => {
        console.log('   fetch result: ', response);
        if (response.ok) {
          console.log('   fetch operation OK');
          // returns the response from server: the saved location (with _id)
          resolve(response.json());
        } else throw new Error('saveLocation - Response was not ok.');
      })
      .catch((error) => {
        console.error(`saveLocation - There has been a problem with your fetch operation: ${error.message}`);
        reject(Error(error.message));
      });
      console.log('} RateContainer.saveLocation');
    });
  }

  saveMarks(savedLocation) {
    const idLocation = savedLocation.place._id;

    // Return a new promise.
    return new Promise((resolve, reject) => {
      console.log('{ RateContainer.saveMarks');

      const mark = { 
        item: this.values.item,
        place: idLocation,
        marks: [
          { name: 'markOverall', value: this.values.markOverall },
          { name: 'markFood', value: this.values.markFood },
          { name: 'markPlace', value: this.values.markPlace },
          { name: 'markStaff', value: this.values.markStaff },
        ],
      };
      console.log('   mark: ', mark);

      fetch('/api/marks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mark }),
      })
      .then((response) => {
        console.log('   fetch result: ', response);
        if (response.ok) {
          console.log('   fetch operation OK');
          // returns the response from server: the saved location (with _id)
          resolve(response.json());
        } else throw new Error('saveMarks - Response was not ok.');
      })
      .catch((error) => {
        console.error(`saveMarks - There has been a problem with your fetch operation: ${error.message}`);
        reject(Error(error.message));
      });
      console.log('} RateContainer.saveMarks');
    });
  }


  saveDone(savedMark) {
    console.log(`saveDone - mark saved: ${stringifyOnce(savedMark, null, 2)}`);
  }

//         {this.state.alertStatus !== 0 && <Alert color={this.state.alertColor}>{this.state.alertMessage}</Alert>}


  render() {
    return (
      <Container fluid>
        <RateForm onSubmit={this.submitForm} />
      </Container>

    );
  }
}


// Decorate the form component
export default reduxForm({
  form: 'rate',
})(RateContainer);
