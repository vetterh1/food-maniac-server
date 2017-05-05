import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { Button, FormGroup } from 'reactstrap';
import ListItemsContainer from '../pages/ListItemsContainer';
import ListCategoriesContainer from '../pages/ListCategoriesContainer';
import ListKindsContainer from '../pages/ListKindsContainer';
import SelectSearchDistance from '../utils/SelectSearchDistance';
import Geolocation from '../utils/Geolocation';


class SearchItemForm extends React.Component {

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
    const { filter, handleSubmit, pristine, reset, submitting, onSearchItemError } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <h4 className="mb-4">What?</h4>
          <ListCategoriesContainer />
          <ListKindsContainer />
          <ListItemsContainer URL="/api/items" itemsPerPage={50} carrousel={false} filter={filter} onSearchItemError={onSearchItemError} />
        </FormGroup>
        <FormGroup>
          <h4 className="mb-4">Max distance?</h4>
          <FormGroup row className="no-gutters">
            <SelectSearchDistance />
          </FormGroup>
        </FormGroup>
        <Button type="submit" disabled={pristine || submitting} size="md">Find</Button>
        <Button color="link" onClick={this.resetForm} size="md">Reset</Button>
      </form>
    );
  }
}

SearchItemForm = reduxForm({
  form: 'SearchItemForm',
})(SearchItemForm);



// Decorate with connect to read form values
const selector = formValueSelector('SearchItemForm');
SearchItemForm = connect(
  (state) => {
    const { category, kind } = selector(state, 'category', 'kind');
    const filterSeparator = category && kind ? ',' : '';
    const filterCategory = category ? `"category":"${category}"` : '';
    const filterKind = kind ? `"kind":"${kind}"` : '';
    const filter = `{${filterCategory}${filterSeparator}${filterKind}}`;
    console.log('filter: ', filter);
    return { filter };
  }
)(SearchItemForm);

export default SearchItemForm;