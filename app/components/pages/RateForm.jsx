/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup } from 'reactstrap';
import RatingStarsRow from '../utils/RatingStarsRow';
import ListItems from '../pages/ListItems';
import ListCategories from '../pages/ListCategories';
import ListKinds from '../pages/ListKinds';
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
    // this.getVisibleItems = this.getVisibleItems.bind(this);

    this.state = {
      // unique key for the form --> used for reset form
      keyForm: Date.now(),  

      // Full list of Kinds, Categories & Items:
      kinds: props.kinds,
      categories: props.categories,
      items: props.items,

      // Selected Kind, Category & Item:
      kind: null,
      category: null,
      item: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps) return;
    let needUpdate = false;
    const updState = {};
    if (nextProps.kinds && nextProps.kinds !== this.state.kinds) { updState.kinds = nextProps.kinds; needUpdate = true; }
    if (nextProps.categories && nextProps.categories !== this.state.categories) { updState.categories = nextProps.categories; needUpdate = true; }
    if (nextProps.items && nextProps.items !== this.state.items) { updState.items = nextProps.items; needUpdate = true; }
    if (needUpdate) { this.setState(updState); }
  }


  onChangeKind(event) {
    if (this.state.kind === event.target.value) return;
    this.setState({ kind: event.target.value, items: this.getVisibleItems(event.target.value, this.state.category) });
  }

  onChangeCategory(event) {
    if (this.state.category === event.target.value) return;
    this.setState({ category: event.target.value, items: this.getVisibleItems(this.state.kind, event.target.value) });
  }

  onChangeItem(event) {
    if (this.state.item === event.target.value) return;
    this.setState({ item: event.target.value });
  }


  onChangeLocation(event) {
    // if (this.state.category === event.target.value) return;
    // this.setState({ category: event.target.value, items: this.getVisibleItems(this.state.kind, event.target.value) });
  }


  onChangeMarkOverall(event) {
  }

  onChangeMarkFood(event) {
  }

  onChangeMarkPlace(event) {
  }

  onChangeMarkValue(event) {
  }

  onChangeMarkStaff(event) {
  }

  onChangeComment(event) {
  }

  getVisibleItems(kind, category) {
    return this.props.items.filter((item) => {
      const kindCondition = (kind && kind !== undefined && kind !== '--all--' ? item.kind === kind : true);
      const categoryCondition = (category && category !== undefined && category !== '--all--' ? item.category === category : true);
      return kindCondition && categoryCondition;
    });
  }


  resetForm() {
    // Reset the form & clear the image
    this.setState({ keyForm: Date.now() });
  }

  render() {
    console.log('render RateForm');
    return (
      <Form onSubmit={this.props.onSubmit}>
        <FormGroup>
          <h4 className="mb-4">What?</h4>
          <ListCategories categories={this.state.categories} onChange={this.onChangeCategory.bind(this)} dropdown />
          <ListKinds kinds={this.state.kinds} onChange={this.onChangeKind.bind(this)} dropdown />
          <ListItems items={this.state.items} onChange={this.onChangeItem.bind(this)} dropdown />
        </FormGroup>

        <FormGroup>
          <h4 className="mb-4">Where?</h4>
          <SelectLocation places={this.props.places} onChange={this.onChangeLocation.bind(this)} />
        </FormGroup>

        <FormGroup>
          <h4 className="mb-4">Marks</h4>
          <div>
            <RatingStarsRow name="markOverall" label="Overall" onChange={this.onChangeMarkOverall.bind(this)} size={30} />
            <RatingStarsRow name="markFood" label="Food" onChange={this.onChangeMarkFood.bind(this)} />
            <RatingStarsRow name="markValue" label="Value" onChange={this.onChangeMarkValue.bind(this)} />
            <RatingStarsRow name="markPlace" label="Place" onChange={this.onChangeMarkPlace.bind(this)} />
            <RatingStarsRow name="markStaff" label="Staff" onChange={this.onChangeMarkStaff.bind(this)} />
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

// export default reduxForm({ form: 'RateForm', })(RateForm);

export default RateForm;


/*
          <SelectLocation onSelectLocationError={onSelectLocationError} />

          <Field name="comment" component={ReactFormInput} type="edit" size="md" />

*/