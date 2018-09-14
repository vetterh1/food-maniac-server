import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Container, Col, Form,
  FormGroup, Label, Input,
  InputGroup, InputGroupAddon,
  Button,
} from 'reactstrap';

class CheckoutForm extends Component {

  static propTypes = {
    onContinue: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    editMode: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);

    this.defaultState = {
      // unique key for the form --> used for reset form
      keyForm: Date.now(),

      amount: 10,
      orderId: Date.now().toString()
    };

    this.state = {
      ...this.defaultState,
    };
  }



  onChangeAmount = event => this.setState({ amount: event.target.value })
  onChangeOrderId = event => this.setState({ orderId: event.target.value })


  onReset() {
    this.setState(this.defaultState);
    this.props.onReset();
  }




  onSubmit(event) {
    event.preventDefault();

    // The amount is x 100 as it's sent to the Payment Gateway in cents!

    const returnValue = {
      amount: this.state.amount * 100,
      orderId: this.state.orderId,
    };
    if(this.props.editMode)
      this.props.onContinue(returnValue);

  }



  render() {
    return (
      <Container className="App">
        <h2>Checkout</h2>
        <Form className="form" onSubmit={this.onSubmit.bind(this)}>
          <Col>
            <FormGroup>
              <Label for="amountInput">Amount (EUR)</Label>
              <InputGroup>
                <Input
                  type="number"
                  name="amount"
                  id="amountInput"
                  step="1"
                  onChange={this.onChangeAmount.bind(this)}
                  value={this.state.amount} 
                  readOnly={!this.props.editMode}
                />
                <InputGroupAddon addonType="append">.00 EUR</InputGroupAddon>
              </InputGroup>

            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="orderIdInput">Order Id</Label>
              <Input
                name="orderId"
                id="orderIdInput"
                onChange={this.onChangeOrderId.bind(this)}
                value={this.state.orderId}   
                placeholder="Enter a unique order id"
                readOnly={!this.props.editMode}
              />
            </FormGroup>
          </Col>
          <Col>
            { this.props.editMode && <Button>Continue...</Button> }
            { this.props.editMode && <Button color="link" onClick={this.onReset.bind(this)}>Reset</Button> }
          </Col>
        </Form>
      </Container>
    );
  }
}

export default CheckoutForm;