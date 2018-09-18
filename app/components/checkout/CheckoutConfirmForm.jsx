import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Container, Col, Row, Form,
  FormGroup, Label, Input,
  Button,
} from 'reactstrap';

class CheckoutConfirmForm extends Component {
  static propTypes = {
    pspid: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
    orderId: PropTypes.string.isRequired,
    shasign: PropTypes.string.isRequired,
    onBack: PropTypes.func.isRequired,
  }

  onBack = () => this.props.onBack();


/*
    The form redirects to OGONE website.
    If the transaction is successful OGONE redirects to such a page:
    https://food-maniac.com/eshop-ok?orderID=Test1234&currency=EUR&amount=12%2E34&PM=CreditCard&ACCEPTANCE=test123&STATUS=5&CARDNO=XXXXXXXXXXXX1151&ED=0319&CN=laurent+VETTERHOEFFER&TRXDATE=09%2F14%2F18&PAYID=3040201007&PAYIDSUB=0&NCERROR=0&BRAND=VISA&DCC_INDICATOR=0&DCC_EXCHRATE=&DCC_EXCHRATETS=&DCC_CONVCCY=&DCC_CONVAMOUNT=&DCC_VALIDHOURS=&DCC_EXCHRATESOURCE=&DCC_MARGINPERCENTAGE=&DCC_COMMPERCENTAGE=&IP=195%2E78%2E50%2E2&SHASIGN=B03569100310A8201AA8A7023EADECF00182695BD32B1546FD704D0547AB09B012816B3706E3E03863869C147AF2DD729C91B805C02333ED9177FA99E5D8B8A3
*/

  render() {
    return (
      <Container className="Confirm">
        <Col>Please confirm your purchase...</Col>
        <Form method="POST" action="https://secure.ogone.com/ncol/test/orderstandard.asp" id="form1" name="form1">
          <input type="hidden" NAME="PSPID" value={this.props.pspid} />
          <input type="hidden" NAME="ORDERID" value={this.props.orderId} />
          <input type="hidden" NAME="AMOUNT" value={this.props.amount} />
          <input type="hidden" NAME="CURRENCY" value={this.props.currency} />
          <input type="hidden" NAME="SHASIGN" value={this.props.shasign} />
          <Col>
            <Button id="confirm">Confirm</Button>
            <Button color="link" onClick={this.onBack.bind(this)}>Back</Button>
          </Col>
        </Form>
      </Container>
    );
  }
}

export default CheckoutConfirmForm;