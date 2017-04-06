import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { Container, Col, Button, Label, Form, FormGroup, Alert } from 'reactstrap';
import ReactFormRating from '../utils/ReactFormRating';
import SelectLocation from '../utils/SelectLocation';
import ListItemsContainer from '../pages/ListItemsContainer';

const styles = {
  form: {
    // width: 300,
    // margin: '20 auto',
    padding: 20,
  },
  imageCameraSnapshot: {
    maxWidth: 300,
    maxHeight: 200,
  },
  switchStyle: {
    marginBottom: 16,
  },
  submitStyle: {
    marginTop: 32,
  },

  markContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  markLine: {
    padding: '1em',
  },
  markLabel: {
  },
  markRate: {
  },
};


class Rate extends React.Component {
  static propTypes = {
//    onSubmit: React.PropTypes.func.isRequired,
  }

  constructor() {
    super();
//    this._handleClick = this._handleClick.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.resetForm = this.resetForm.bind(this);

    this.state = {
      keyForm: Date.now(),  // unique key for the form --> used for reset form
      canSubmit: false,
      // alertStatus possible values:
      // -  0: no alerts
      //  - saving alerts:  1: saving, 2: saving OK, -1: saving KO
      alertStatus: 0,
      alertMessage: '',
    };
  }


  onRate({ rating, lastRating, originalEvent }) {
    if (originalEvent.type === 'click' && rating === lastRating) {
    // set prop of Rater to 0
    }
  }

  submitForm(event, values) {
    // console.log('submitForm - state:', this.state);

    // Add picture to data
    // const dataWithPicture = Object.assign({}, values, { picture: this.state.picture });
    // this.setState({ values }, this.props.onSubmit(dataWithPicture)); // callback fn: send data back to container

//    this.props.onSubmit(values);
  }

  resetForm() {
    // Reset the form & clear the image
    this.setState({ keyForm: Date.now() });
  }



  _handleClick() {
//    browserHistory.push(this.props.url);
  }


  render() {
    const defaultValues = {
    };

    const { handleSubmit } = this.props;

    return (
      <Container fluid>
        {this.state.alertStatus !== 0 && <Alert color={this.state.alertColor}>{this.state.alertMessage}</Alert>}

        <h2 className="mb-4">Rate a dish...</h2>
        <Form
          // key={this.state.keyForm}  // unique key that let reset the form by changing the state keyForm
          // onValid={this.enableButton}
          // onInvalid={this.disableButton}
          onSubmit={this.submitForm}
          // onInvalidSubmit={this.notifyFormError}
          // model={defaultValues}
        >
          <FormGroup>
            <h4 className="mb-4">What?</h4>
            <ListItemsContainer URL="/api/items" itemsPerPage={10} carrousel={false} />
          </FormGroup>

          <FormGroup>
            <h4 className="mb-4">Where?</h4>
            <SelectLocation />
          </FormGroup>

          <FormGroup>
            <h4 className="mb-4">Marks</h4>
            <div>
              <FormGroup row>
                <Col xs={3} lg={2} >
                  <Label for="markOverall" className="text-right">Overall</Label>
                </Col>
                <Col xs={9} lg={10} >
                  <Field
                    name="markOverall"
                    component={ReactFormRating}
                    size={30}
                    style={styles.markRate}
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col xs={3} lg={2} >
                  <Label for="markQuality" className="text-right">Quality</Label>
                </Col>
                <Col xs={9} lg={10} >
                  <Field
                    name="markQuality"
                    component={ReactFormRating}
                    style={styles.markRate}
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col xs={3} lg={2} >
                  <Label for="markPlace" className="text-right">Place</Label>
                </Col>
                <Col xs={9} lg={10} >
                  <Field
                    name="markPlace"
                    component={ReactFormRating}
                    style={styles.markRate}
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col xs={3} lg={2} >
                  <Label for="markStaff" className="text-right">Staff</Label>
                </Col>
                <Col xs={9} lg={10} >
                  <Field
                    name="markStaff"
                    component={ReactFormRating}
                    style={styles.markRate}
                  />
                </Col>
              </FormGroup>
            </div>
          </FormGroup>

          <Button type="submit" size="md">Add</Button>
          <Button color="link" onClick={this.resetForm} size="md">Reset</Button>
        </Form>
      </Container>

    );
  }
}



/*

      <Container fluid>

        {this.state.alertStatus !== 0 && <Alert color={this.state.alertColor}>{this.state.alertMessage}</Alert>}

        <h2 className="mb-4">Rate a dish...</h2>
        <Form
          // key={this.state.keyForm}  // unique key that let reset the form by changing the state keyForm
          // onValid={this.enableButton}
          // onInvalid={this.disableButton}
          onSubmit={this.submitForm}
          // onInvalidSubmit={this.notifyFormError}
          // model={defaultValues}
        >
          <FormGroup>
            <h4 className="mb-4">What?</h4>
            <ListItemsContainer URL="/api/items" itemsPerPage={10} />
          </FormGroup>




          <Button type="submit" size="md">Add</Button>
          <Button color="link" onClick={this.resetForm} size="md">Reset</Button>
        </Form>
      </Container>

 */


// Decorate the form component
Rate = reduxForm({
  form: 'rate',
})(Rate);

export default Rate;
