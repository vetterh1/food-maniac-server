/* eslint-disable react/forbid-prop-types */

import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardTitle, Col, Collapse, Form, Label, Row } from 'reactstrap';
import MdMap from 'react-icons/lib/md/map';
import MdLocationSearching from 'react-icons/lib/md/location-searching';
import SimpleListOrDropdown from '../utils/SimpleListOrDropdown';
import SelectItemPlus from '../utils/SelectItemPlus';
import { loglevelServerSend } from '../../utils/loglevel-serverSend';

const logSearchItemForm = log.getLogger('logSearchItemForm');
loglevelServerSend(logSearchItemForm); // a setLevel() MUST be run AFTER this!
logSearchItemForm.setLevel('debug');


class SearchItemForm extends React.Component {
  static propTypes = {
    kinds: PropTypes.object.isRequired,
    categories: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    onRequestSimulateLocation: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    logSearchItemForm.debug('SearchItemForm constructor props: ', props);

    this._refSelectItemPlus = null; // used to reset the 3 dropdowns

    this.defaultState = {
      // unique key for the form --> used for reset form
      keyForm: Date.now(),

      item: null,
      distance: '500',
    };

    this.state = {
      ...this.defaultState,
    };
  }

  onSubmit(event) {
    event.preventDefault();

    const returnValue = {
      item: this.state.item,
      distance: this.state.distance,
    };
    this.refSubmit.blur();
    this.props.onSubmit(returnValue);
  }


  onChangeItem(item) {
    if (this.state.item === item) return;
    this.setState({ item });
  }


  onChangeDistance(event) {
    if (this.state.distance === event.target.value) return;
    this.setState({ distance: event.target.value });
  }

  onOpenSimulateLocation() {
    this.props.onRequestSimulateLocation();
  }

  getPredifinedDistances() {
    return [
      { id: '200', name: '200 metres' },
      { id: '500', name: '500 metres' },
      { id: '1000', name: '1 kilometre' },
      { id: '5000', name: '5 kilometres' },
      { id: '10000', name: '10 kilometres' },
      { id: '50000', name: '50 kilometres' },
      { id: '100000', name: '100 kilometres' },
      { id: '500000', name: '500 kilometres' },
      { id: '0', name: 'no restriction' },
    ];
  }

  resetForm() {
    // Reset the form & clear the image
    this.setState(Object.assign({}, this.defaultState));
    this._refSelectItemPlus.reset();
    this.refReset.blur();
    window.scrollTo(0, 0);
    this.props.resetForm();
  }

  render() {
    logSearchItemForm.debug('render SearchItemForm: (category, kind, item)=', this.state.category, this.state.kind, this.state.item);
    const formReadyForSubmit = true; // Always propose submit now that 'All' the default item.
    // const formReadyForSubmit = this.state.item && this.state.distance;
    return (
      <div className="standard-container">
        <h3 className="mb-4">Seach the best place!</h3>
        <Form onSubmit={this.onSubmit.bind(this)}>
          <SelectItemPlus
            title="What?"
            kinds={this.props.kinds.kinds}
            categories={this.props.categories.categories}
            items={this.props.items}
            onChangeItem={this.onChangeItem.bind(this)}
            ref={(r) => { this._refSelectItemPlus = r; }} // used to reset the 3 dropdowns
          />

          <div className="mt-4">
            <h5 className="mb-3"><MdLocationSearching size={24} className="mr-2 hidden-sm-up" /> Where</h5>
            <Row className="form-block" noGutters>
              <Col sm={2}>
                <Row style={{ display: 'flex', justifyContent: 'center' }}>
                  <div className="homepage-feature-icon hidden-xs-down"><MdLocationSearching size={48} /></div>
                </Row>
                <Row style={{ display: 'flex', justifyContent: 'center' }}>
                  <Label size="md" className="hidden-xs-down">Max distance</Label>
                </Row>
              </Col>
              <Col xs={12} sm={10}>
                <Row>
                  <Col xs={12} className="">
                    <SimpleListOrDropdown items={this.getPredifinedDistances()} selectedOption={this.state.distance} onChange={this.onChangeDistance.bind(this)} dropdown />
                  </Col>
                </Row>
                <Row>
                  <Col xs={6} sm={4}>
                    <Button block color="secondary" size="sm" onClick={this.onOpenSimulateLocation.bind(this)}><MdMap className="mr-2" size={24} /> Map</Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>

          <div className="mt-4">
            <Button color="primary" type="submit" size="md" disabled={!formReadyForSubmit} getRef={(ref) => { this.refSubmit = ref; }} >Find</Button>
            <Button color="link" onClick={this.resetForm.bind(this)} size="md" getRef={(ref) => { this.refReset = ref; }}>Reset</Button>
          </div>
        </Form>
      </div>
    );
  }
}

export default SearchItemForm;
