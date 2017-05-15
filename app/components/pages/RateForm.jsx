/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup } from 'reactstrap';
import RatingStarsRow from '../utils/RatingStarsRow';
import SimpleListOrDropdown from '../pages/SimpleListOrDropdown';
import SelectLocation from '../utils/SelectLocation';
// import ReactFormInput from '../utils/ReactFormInput';
// import ListItemsContainer from '../pages/ListItemsContainer';

        // onSearchItemError={this.onSearchItemError} onSelectLocationError={this.onSelectLocationError} />


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

      comment: null,
    };

    this.state = {
      // Items received from redux-store
      // and stored in state as it's altered by kind & category filters
      items: props.items,
      item: undefined,

      // Empty marks, kind, categories & items:
      ...this.defaultState,
    };
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
        console.log('...and update default selected item!');
        updState.item = nextProps.items[0].id;
      }
    } else console.log('...NO update items!');

    // Prepare the default location selection if necessary
    if (nextProps.places && nextProps.places.places.length > 0 && (!this.state.location || this.state.location === '')) {
      console.log(`componentWillReceiveProps update default place to ${nextProps.places.places[0].id}`);
      updState.location = nextProps.places.places[0].id;
      needUpdate = true;
    }

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
    console.log('onChangeLocation:', event);
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
    console.log('onChangeLocation:', event);
  }

  // return an object of this kind: {items: xxxx, item: id_of_1st_item}
  getVisibleItems(kind, category) {
    const items = this.props.items.filter((item) => {
      const kindCondition = (kind && kind !== undefined && kind !== '--all--' ? item.kind === kind : true);
      const categoryCondition = (category && category !== undefined && category !== '--all--' ? item.category === category : true);
      return kindCondition && categoryCondition;
    });
    const item = items.length > 0 ? items[0]._id : null;
    return { items, item };
  }


  resetForm() {
    // Reset the form & clear the image
    this.setState(Object.assign({
      // Reset with full list of items,
      items: this.props.items,
      // Select the 1st item
      item: this.props.items.length > 0 ? this.props.items[0]._id : null,
      // Reset default location to the 1st one in the list
      location: this.props.places && this.props.places.places && this.props.places.places.length > 0 ? this.props.places.places[0].id : null,
    },
    // Erase marks & reset kind, categories & items:
    this.defaultState,
    ));
  }

  render() {
    console.log('render: (category, kind, item)=', this.state.category, this.state.kind, this.state.item);
    return (
      <Form onSubmit={this.onSubmit.bind(this)}>
        <FormGroup>
          <h4 className="mb-4">What?</h4>
          <SimpleListOrDropdown items={this.props.categories} selectedOption={this.state.category} onChange={this.onChangeCategory.bind(this)} dropdown />
          <SimpleListOrDropdown items={this.props.kinds} selectedOption={this.state.kind} onChange={this.onChangeKind.bind(this)} dropdown />
          <SimpleListOrDropdown items={this.state.items} selectedOption={this.state.item} onChange={this.onChangeItem.bind(this)} dropdown />
        </FormGroup>

        <FormGroup>
          <h4 className="mb-4">Where?</h4>
          <SimpleListOrDropdown items={this.props.places.places} selectedOption={this.state.location} onChange={this.onChangeLocation.bind(this)} dropdown />
        </FormGroup>

        <FormGroup>
          <h4 className="mb-4">Marks</h4>
          <div>
            <RatingStarsRow name="markOverall" label="Overall" initialRate={this.state.markOverall} onChange={this.onChangeMarkOverall.bind(this)} size={30} />
            <RatingStarsRow name="markFood" label="Food" initialRate={this.state.markFood} onChange={this.onChangeMarkFood.bind(this)} />
            <RatingStarsRow name="markValue" label="Value" initialRate={this.state.markValue} onChange={this.onChangeMarkValue.bind(this)} />
            <RatingStarsRow name="markPlace" label="Place" initialRate={this.state.markPlace} onChange={this.onChangeMarkPlace.bind(this)} />
            <RatingStarsRow name="markStaff" label="Staff" initialRate={this.state.markStaff} onChange={this.onChangeMarkStaff.bind(this)} />
          </div>
        </FormGroup>

        <FormGroup>
          <h4 className="mb-4">Comment?</h4>
        </FormGroup>

        <Button type="submit" size="md">Add</Button>
        <Button color="link" onClick={this.resetForm.bind(this)} size="md">Reset</Button>
      </Form>
    );
  }
}

export default RateForm;
