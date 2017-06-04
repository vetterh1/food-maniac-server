/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Form, FormGroup, Label } from 'reactstrap';
import SimpleListOrDropdown from '../utils/SimpleListOrDropdown';

const styles = {
  form: {
    // width: 300,
    // margin: '20 auto',
    padding: 20,
  },
};

class SearchItemForm extends React.Component {
  static propTypes = {
    kinds: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    items: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    console.log('SearchItemForm constructor props: ', props);

    this.defaultState = {
      // unique key for the form --> used for reset form
      keyForm: Date.now(),

      // Selected Kind & Category:
      kind: '--all--',
      category: '--all--',
      // default item is defined by getVisibleItems

      distance: '500',
    };

    this.state = {
      // Items received from redux-store
      // and stored in state as it's altered by kind & category filters
      items: props.items,
      item: props.items.length > 0 ? this.props.items[0].id : undefined,

      // Empty marks, kind, categories & items:
      ...this.defaultState,
    };
  }

  componentWillReceiveProps(nextProps) {
    // console.log('componentWillReceiveProps nextProps: ', nextProps);

    if (!nextProps) return;
    let needUpdate = false;
    const updState = {};

    // console.log('componentWillReceiveProps items (length & 1st) crt --> : ',
    //  !this.state.items || this.state.items.length <= 0 ? 'null or empty' : this.state.items.length, this.state.items[0]);

    // console.log('componentWillReceiveProps items (length & 1st) --> next: ',
    //  !nextProps.items || nextProps.items.length <= 0 ? 'null or empty' : nextProps.items.length, nextProps.items[0]);

    // Items list copy from redux --> state as the items list changes (with kind & category filters)
    if (nextProps.items && nextProps.items.length > 0 && nextProps.items !== this.state.items) {
      // Filter the new list with kind & category
      const { items: visibleItemsAndDefaultItem, item: visibleDefaultItem } = this.getVisibleItems(this.state.kind, this.state.category, nextProps.items);

      // console.log('componentWillReceiveProps visibleItemsAndDefaultItem (length & 1st): ',
      //  !visibleItemsAndDefaultItem || visibleItemsAndDefaultItem.length <= 0 ? 'null or empty' : visibleItemsAndDefaultItem.length,
      //  !visibleItemsAndDefaultItem || visibleItemsAndDefaultItem.length <= 0 ? 'N/A' : visibleItemsAndDefaultItem[0],
      //  visibleDefaultItem);

      if (visibleItemsAndDefaultItem !== this.state.items) {
        // console.log('...update items!');
        updState.items = visibleItemsAndDefaultItem;
        needUpdate = true;

        // Select the 1st item in the list if none yet selected
        if (!this.state.item || this.state.item === '') {
          // console.log('...and update default selected item!');
          updState.item = visibleDefaultItem;
        } // else console.log('componentWillReceiveProps NO update default item');
      } // else console.log('...NO update items (after getVisibleItems check)!');
    } // else console.log('...NO update items!');

    // Launch the state update
    if (needUpdate) { this.setState(updState); }
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

  onChangeKind(event) {
    if (this.state.kind === event.target.value) return;
    this.setState(Object.assign({ kind: event.target.value }, this.getVisibleItems(event.target.value, this.state.category)));
  }

  onChangeCategory(event) {
    if (this.state.category === event.target.value) return;
    this.setState(Object.assign({ category: event.target.value }, this.getVisibleItems(this.state.kind, event.target.value)));
  }

  onChangeItem(event) {
    if (this.state.item === event.target.value) return;
    this.setState({ item: event.target.value });
  }


  onChangeDistance(event) {
    if (this.state.distance === event.target.value) return;
    this.setState({ distance: event.target.value });
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

  // return an object of this kind: {items: xxxx, item: id_of_1st_item}
  getVisibleItems(kind, category, itemsOriginal = this.props.items) {
    // console.log('getVisibleItems: (kind, category, itemsOriginal): ', kind, category, itemsOriginal);
    const items = itemsOriginal.filter((item) => {
      const kindCondition = (kind && kind !== undefined && kind !== '--all--' ? item.kind === kind : true);
      const categoryCondition = (category && category !== undefined && category !== '--all--' ? item.category === category : true);
      return kindCondition && categoryCondition;
    });
    const item = items.length > 0 ? items[0]._id : null;
    // console.log('getVisibleItems returns: (items, item): ', items, item);
    return { items, item };
  }


  resetForm() {
    // Reset the form & clear the image
    this.setState(Object.assign({
      // Reset with full list of items,
      items: this.props.items,
      // Select the 1st item
      item: this.props.items.length > 0 ? this.props.items[0]._id : null,
    },
    // Reset distance:
    this.defaultState,
    ));
    this.refReset.blur();
    window.scrollTo(0, 0);
    this.props.resetForm();
  }

  render() {
    console.log('render SearchItemForm: (category, kind, item)=', this.state.category, this.state.kind, this.state.item);
    const formReadyForSubmit = this.state.item && this.state.distance;
    return (
      <div style={styles.form}>
        <h3 className="mb-4">Search dish...</h3>
        <Form onSubmit={this.onSubmit.bind(this)}>
          <FormGroup>
            <h5 className="mb-3">What?</h5>
            <FormGroup row>
              <Col xs={3} lg={2} >
                <Label size="md">Category</Label>
              </Col>
              <Col xs={9} lg={10} >
                <SimpleListOrDropdown items={this.props.categories} selectedOption={this.state.category} onChange={this.onChangeCategory.bind(this)} dropdown />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col xs={3} lg={2} >
                <Label size="md">Kind</Label>
              </Col>
              <Col xs={9} lg={10} >
                <SimpleListOrDropdown items={this.props.kinds} selectedOption={this.state.kind} onChange={this.onChangeKind.bind(this)} dropdown />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col xs={3} lg={2} >
                <Label size="md">Item</Label>
              </Col>
              <Col xs={9} lg={10} >
                <SimpleListOrDropdown items={this.state.items} selectedOption={this.state.item} onChange={this.onChangeItem.bind(this)} dropdown />
              </Col>
            </FormGroup>
          </FormGroup>

          <FormGroup>
            <h5 className="mb-4">Max distance?</h5>
            <FormGroup row className="no-gutters">
              <SimpleListOrDropdown items={this.getPredifinedDistances()} selectedOption={this.state.distance} onChange={this.onChangeDistance.bind(this)} dropdown />
            </FormGroup>
          </FormGroup>

          <Button type="submit" size="md" disabled={!formReadyForSubmit} getRef={(ref) => { this.refSubmit = ref; }} >Find</Button>
          <Button color="link" onClick={this.resetForm.bind(this)} size="md" getRef={(ref) => { this.refReset = ref; }}>Reset</Button>
        </Form>
      </div>
    );
  }
}

export default SearchItemForm;
