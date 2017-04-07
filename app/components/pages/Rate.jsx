import React from 'react';
import { reduxForm } from 'redux-form';
import { Container } from 'reactstrap';
import RateForm from './RateForm';
import stringifyOnce from '../../utils/stringifyOnce';

const submitForm = (values) => {
    window.alert(`values:\n\n${stringifyOnce(values, null, 2)}`);
};


class Rate extends React.Component {
  static propTypes = {
  }


//         {this.state.alertStatus !== 0 && <Alert color={this.state.alertColor}>{this.state.alertMessage}</Alert>}


  render() {
    return (
      <Container fluid>
        <RateForm onSubmit={submitForm} />
      </Container>

    );
  }
}


// Decorate the form component
export default reduxForm({
  form: 'rate',
})(Rate);
