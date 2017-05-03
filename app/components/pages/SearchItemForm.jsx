import React from 'react';
import { reduxForm } from 'redux-form';
import { Button, Col, FormGroup } from 'reactstrap';
import ListItemsContainer from '../pages/ListItemsContainer';
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
    const { handleSubmit, pristine, reset, submitting, onSearchItemError } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <h4 className="mb-4">What?</h4>
          <ListItemsContainer URL="/api/items" itemsPerPage={50} carrousel={false} onSearchItemError={onSearchItemError} />
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

export default reduxForm({
  form: 'SearchItemForm',
})(SearchItemForm);

//           <ListItemTypesContainer onSearchItemError={onSearchItemError} />
