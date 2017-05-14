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
    places: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.defaultState = {
      // unique key for the form --> used for reset form
      keyForm: Date.now(),

      // Selected Kind, Category & Item:
      kind: '--all--',
      category: '--all--',

      location: null,

      markOverall: null,
      markFood: null,
      markPlace: null,
      markValue: null,
      markStaff: null,

      comment: null,
    };

    this.state = {
      // Full list of Kinds, Categories & Items:
      kinds: props.kinds,
      categories: props.categories,
      items: props.items,

      // Empty marks, kind, categories & items:
      ...this.defaultState,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps) return;
    let needUpdate = false;
    const updState = {};

    // Prepare the lists updates if necessary
    if (nextProps.kinds && nextProps.kinds !== this.state.kinds) { updState.kinds = nextProps.kinds; needUpdate = true; }
    if (nextProps.categories && nextProps.categories !== this.state.categories) { updState.categories = nextProps.categories; needUpdate = true; }
    if (nextProps.items && nextProps.items !== this.state.items) { updState.items = nextProps.items; needUpdate = true; }

    // Prepare the default item selection if necessary
    if (nextProps.items && nextProps.items.length > 0 && nextProps.items !== this.state.items) {
      console.log('componentWillReceiveProps items (length & 1st): ', nextProps.items.length, nextProps.items[0]);
      if (!this.state.item || this.state.item === '') updState.item = nextProps.items[0].id;
    }

    // Prepare the default location selection if necessary
    if (nextProps.places && nextProps.places.length > 0 && nextProps.places !== this.state.places) {
      console.log('componentWillReceiveProps places (length & 1st): ', nextProps.places.length, nextProps.places[0]);
      if (!this.state.location || this.state.location === '') updState.location = nextProps.places[0].id;
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
    // this.setState({
    //   // Full list of Kinds, Categories & Items:
    //   // received from redux-store
    //   kinds: this.props.kinds,
    //   categories: this.props.categories,
    //   items: this.props.items,

    //   // Empty marks, kind, categories & items:
    //   ...this.defaultState,
    // });
    this.setState(Object.assign({
      // Full list of Kinds, Categories & Items:
      // received from redux-store
      kinds: this.props.kinds,
      categories: this.props.categories,
      items: this.props.items,
    },
    // Empty marks, kind, categories & items:
    this.defaultState,
    // Select the 1st item
    this.getVisibleItems(null, null)
    ));
  }

  render() {
    return (
      <Form onSubmit={this.onSubmit.bind(this)}>
        <FormGroup>
          <h4 className="mb-4">What?</h4>
          <SimpleListOrDropdown items={this.state.categories} selectedOption={this.state.category} onChange={this.onChangeCategory.bind(this)} dropdown />
          <SimpleListOrDropdown items={this.state.kinds} selectedOption={this.state.kind} onChange={this.onChangeKind.bind(this)} dropdown />
          <SimpleListOrDropdown items={this.state.items} selectedOption={this.state.item} onChange={this.onChangeItem.bind(this)} dropdown />
        </FormGroup>

        <FormGroup>
          <h4 className="mb-4">Where?</h4>
          <SimpleListOrDropdown items={this.props.places} selectedOption={this.state.location} onChange={this.onChangeLocation.bind(this)} dropdown />
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
