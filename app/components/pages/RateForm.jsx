/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup } from 'reactstrap';
import RatingStarsRow from '../utils/RatingStarsRow';
import ListItems from '../pages/ListItems';
import ListCategories from '../pages/ListCategories';
import ListKinds from '../pages/ListKinds';
// import SelectLocation from '../utils/SelectLocation';
// import ReactFormInput from '../utils/ReactFormInput';
// import ListItemsContainer from '../pages/ListItemsContainer';

        // onSearchItemError={this.onSearchItemError} onSelectLocationError={this.onSelectLocationError} />


class RateForm extends React.Component {
  static propTypes = {
    kinds: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    items: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onChangeKind: PropTypes.func.isRequired,
    onChangeCategory: PropTypes.func.isRequired,
    onChangeItem: PropTypes.func.isRequired,
    onChangeLocation: PropTypes.func.isRequired,
    onChangeMarkOverall: PropTypes.func.isRequired,
    onChangeMarkFood: PropTypes.func.isRequired,
    onChangeMarkValue: PropTypes.func.isRequired,
    onChangeMarkPlace: PropTypes.func.isRequired,
    onChangeMarkStaff: PropTypes.func.isRequired,
    onChangeComment: PropTypes.func.isRequired,
  }

  constructor() {
    super();
    this.resetForm = this.resetForm.bind(this);
    this.state = {
      keyForm: Date.now(),  // unique key for the form --> used for reset form
    };
  }

  resetForm() {
    // Reset the form & clear the image
    this.setState({ keyForm: Date.now() });
  }

  render() {
    console.log('render RateForm');
    const { 
      kinds, categories, items, onSubmit, onChangeKind, onChangeCategory, onChangeItem, onChangeLocation, onChangeMarkOverall, onChangeMarkFood, onChangeMarkValue, onChangeMarkPlace, onChangeMarkStaff, onChangeComment
    } = this.props;
    return (
      <Form onSubmit={onSubmit}>
        <FormGroup>
          <h4 className="mb-4">What?</h4>
          <ListCategories categories={categories} onChange={onChangeCategory} dropdown />
          <ListKinds kinds={kinds} onChange={onChangeKind} dropdown />
          <ListItems items={items} onChange={onChangeItem} dropdown />
        </FormGroup>

        <FormGroup>
          <h4 className="mb-4">Where?</h4>
        </FormGroup>

        <FormGroup>
          <h4 className="mb-4">Marks</h4>
          <div>
            <RatingStarsRow name="markOverall" label="Overall" onChange={onChangeMarkOverall} size={30} />
            <RatingStarsRow name="markFood" label="Food" onChange={onChangeMarkFood} />
            <RatingStarsRow name="markValue" label="Value" onChange={onChangeMarkValue} />
            <RatingStarsRow name="markPlace" label="Place" onChange={onChangeMarkPlace} />
            <RatingStarsRow name="markStaff" label="Staff" onChange={onChangeMarkStaff} />
          </div>
        </FormGroup>

        <FormGroup>
          <h4 className="mb-4">Comment?</h4>
        </FormGroup>

        <Button type="submit" size="md">Add</Button>
        <Button color="link" onClick={this.resetForm} size="md">Reset</Button>
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