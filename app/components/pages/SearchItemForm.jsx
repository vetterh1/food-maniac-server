/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup } from 'reactstrap';
import ListItems from '../pages/ListItems';
import ListCategories from '../pages/ListCategories';
import ListKinds from '../pages/ListKinds';
import SelectSearchDistance from '../utils/SelectSearchDistance';


class SearchItemForm extends React.Component {
  static propTypes = {
    kinds: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    items: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onChangeKind: PropTypes.func.isRequired,
    onChangeCategory: PropTypes.func.isRequired,
    onChangeItem: PropTypes.func.isRequired,
    onChangeDistance: PropTypes.func.isRequired,
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
    const { kinds, categories, items, onChangeKind, onChangeCategory, onChangeItem, onChangeDistance, onSubmit } = this.props;
    return (
      <Form>
        <FormGroup>
          <h4 className="mb-4">What?</h4>
          <ListCategories categories={categories} onChange={onChangeCategory} dropdown />
          <ListKinds kinds={kinds} onChange={onChangeKind} dropdown />
          <ListItems items={items} onChange={onChangeItem} dropdown />
        </FormGroup>
        <FormGroup>
          <h4 className="mb-4">Max distance?</h4>
          <FormGroup row className="no-gutters">
            <SelectSearchDistance onChange={onChangeDistance} />
          </FormGroup>
        </FormGroup>
        <Button type="submit" onClick={onSubmit} size="md">Find</Button>
        <Button color="link" onClick={this.resetForm} size="md">Reset</Button>
      </Form>
    );
  }
}

export default SearchItemForm;
