/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import RatingStarsRow from '../utils/RatingStarsRow';
import SimpleListOrDropdown from '../pages/SimpleListOrDropdown';

const styles = {
  form: {
    // width: 300,
    // margin: '20 auto',
    padding: 20,
  },
};

class RateForm extends React.Component {
  static propTypes = {
    kinds: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    items: PropTypes.array.isRequired,
    places: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.defaultState = {
      // unique key for the form --> used for reset form
      keyForm: Date.now(),

      // Selected Kind & Category:
      kind: '--all--',
      category: '--all--',
      // default item is defined by getVisibleItems

      markOverall: null,
      markFood: null,
      markPlace: null,
      markValue: null,
      markStaff: null,

      comment: '',
    };

    this.state = {
      // Items received from redux-store
      // and stored in state as it's altered by kind & category filters
      items: props.items,
      item: props.items.length > 0 ? this.props.items[0].id : undefined,

      location: props.places && props.places.places.length > 0 ? props.places.places[0].id : undefined,

      // Empty marks, kind, categories & items:
      ...this.defaultState,
    };
    console.log('RateForm constructor (props, initial state): ', props, this.state);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps) return;
    let needUpdate = false;
    const updState = {};

    console.log('componentWillReceiveProps items (length & 1st) crt --> : ',
     !this.state.items || this.state.items.length <= 0 ? 'null or empty' : this.state.items.length, this.state.items[0]);

    console.log('componentWillReceiveProps items (length & 1st) --> next: ',
     !nextProps.items || nextProps.items.length <= 0 ? 'null or empty' : nextProps.items.length, nextProps.items[0]);

    // Items list copy from redux --> state as the items list changes (with kind & category filters)
    if (nextProps.items && nextProps.items.length > 0 && nextProps.items !== this.state.items) {
      console.log('...update items!');
      updState.items = nextProps.items;
      needUpdate = true;

      // Select the 1st item in the list if none yet selected
      if (!this.state.item || this.state.item === '') {
        console.log('...and update default item!');
        updState.item = nextProps.items[0].id;
      } else console.log('componentWillReceiveProps NO update default item');
    } else console.log('...NO update items!');

    // Prepare the default location selection if necessary
    if (nextProps.places && nextProps.places.places.length > 0 && (!this.state.location || this.state.location === '')) {
      console.log(`componentWillReceiveProps update default place to ${nextProps.places.places[0].id}`);
      updState.location = nextProps.places.places[0].id;
      needUpdate = true;
    } else console.log('componentWillReceiveProps NO update default place');

    // Launch the state update
    if (needUpdate) { this.setState(updState); }
  }


  onSubmit(event) {
    event.preventDefault();

    const returnValue = {
      item: this.state.item,
      location: this.state.location,
      markOverall: this.state.markOverall,
      markFood: this.state.markFood,
      markValue: this.state.markValue,
      markPlace: this.state.markPlace,
      markStaff: this.state.markStaff,
      comment: this.state.comment,
    };
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


  onChangeLocation(event) {
    if (this.state.location === event.target.value) return;
    this.setState({ location: event.target.value });
  }


  onChangeMarkOverall(mark) {
    if (!mark || this.state.markOverall === mark) return;
    this.setState({ markOverall: parseInt(mark, 10) });
  }

  onChangeMarkFood(mark) {
    if (!mark || this.state.markFood === mark) return;
    this.setState({ markFood: parseInt(mark, 10) });
  }

  onChangeMarkValue(mark) {
    if (!mark || this.state.markValue === mark) return;
    this.setState({ markValue: parseInt(mark, 10) });
  }

  onChangeMarkPlace(mark) {
    if (!mark || this.state.markPlace === mark) return;
    this.setState({ markPlace: parseInt(mark, 10) });
  }

  onChangeMarkStaff(mark) {
    if (!mark || this.state.markStaff === mark) return;
    this.setState({ markStaff: parseInt(mark, 10) });
  }

  onChangeComment(event) {
    if (this.state.comment === event.target.value) return;
    this.setState({ comment: event.target.value });
  }

  // return an object of this kind: {items: xxxx, item: id_of_1st_item}
  getVisibleItems(kind, category) {
    const items = this.props.items.filter((item) => {
      const kindCondition = (kind && kind !== undefined && kind !== '--all--' ? item.kind === kind : true);
      const categoryCondition = (category && category !== undefined && category !== '--all--' ? item.category === category : true);
      return kindCondition && categoryCondition;
    });
    const item = items.length > 0 ? items[0].id : null;
    return { items, item };
  }


  resetForm() {
    // Reset the form & clear the image
    this.setState(Object.assign({
      // Reset with full list of items,
      items: this.props.items,
      // Select the 1st item
      item: this.props.items.length > 0 ? this.props.items[0].id : null,
      // Reset default location to the 1st one in the list
      location: this.props.places && this.props.places.places && this.props.places.places.length > 0 ? this.props.places.places[0].id : null,
    },
    // Erase marks & reset kind, categories & items:
    this.defaultState,
    ));
  }

  render() {
    console.log('render: (category, kind, item, location)=', this.state.category, this.state.kind, this.state.item, this.state.location);
    const formReadyForSubmit = this.state.item && this.state.location && this.state.markOverall;
    return (
      <div style={styles.form}>
        <h3 className="mb-4">Rate your plate!</h3>
        <Form onSubmit={this.onSubmit.bind(this)}>
          <FormGroup>
            <h5 className="mb-4">What?</h5>
            <Label size="md">Category</Label>
            <SimpleListOrDropdown items={this.props.categories} selectedOption={this.state.category} onChange={this.onChangeCategory.bind(this)} dropdown />
            <Label size="md">Kind</Label>
            <SimpleListOrDropdown items={this.props.kinds} selectedOption={this.state.kind} onChange={this.onChangeKind.bind(this)} dropdown />
            <Label size="md">Item</Label>
            <SimpleListOrDropdown items={this.state.items} selectedOption={this.state.item} onChange={this.onChangeItem.bind(this)} dropdown />
          </FormGroup>

          <FormGroup>
            <h5 className="mb-4">Where?</h5>
            <SimpleListOrDropdown items={this.props.places.places} selectedOption={this.state.location} onChange={this.onChangeLocation.bind(this)} dropdown />
          </FormGroup>

          <FormGroup>
            <h5 className="mb-4">Marks</h5>
            <div>
              <RatingStarsRow name="markOverall" label="Overall" initialRate={this.state.markOverall} onChange={this.onChangeMarkOverall.bind(this)} mandatoryWarning size={30} />
              <RatingStarsRow name="markFood" label="Food" initialRate={this.state.markFood} onChange={this.onChangeMarkFood.bind(this)} />
              <RatingStarsRow name="markValue" label="Value" initialRate={this.state.markValue} onChange={this.onChangeMarkValue.bind(this)} />
              <RatingStarsRow name="markPlace" label="Place" initialRate={this.state.markPlace} onChange={this.onChangeMarkPlace.bind(this)} />
              <RatingStarsRow name="markStaff" label="Staff" initialRate={this.state.markStaff} onChange={this.onChangeMarkStaff.bind(this)} />
            </div>
          </FormGroup>

          <FormGroup>
            <h5 className="mb-4">Comment?</h5>
            <Input type="textarea" value={this.state.comment} onChange={this.onChangeComment.bind(this)} />
          </FormGroup>

          <Button type="submit" size="md" disabled={!formReadyForSubmit}>Add</Button>
          <Button color="link" onClick={this.resetForm.bind(this)} size="md">Reset</Button>
        </Form>
      </div>
    );
  }
}

export default RateForm;
