import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { Button, FormGroup } from 'reactstrap';
import ReactFormRatingContainer from '../utils/ReactFormRatingContainer';
import SelectLocation from '../utils/SelectLocation';
import ReactFormInput from '../utils/ReactFormInput';
import ListItemsContainer from '../pages/ListItemsContainer';

class RateForm extends React.Component {

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
    const { handleSubmit, pristine, reset, submitting, onSearchItemError, onSelectLocationError } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <h4 className="mb-4">What?</h4>
          <ListItemsContainer URL="/api/items" itemsPerPage={50} carrousel={false} onSearchItemError={onSearchItemError} />
        </FormGroup>

        <FormGroup>
          <h4 className="mb-4">Where?</h4>
          <SelectLocation onSelectLocationError={onSelectLocationError} />
        </FormGroup>

        <FormGroup>
          <h4 className="mb-4">Marks</h4>
          <div>
            <ReactFormRatingContainer name="markOverall" label="Overall" size={30} />
            <ReactFormRatingContainer name="markFood" label="Food" />
            <ReactFormRatingContainer name="markPlace" label="Place" />
            <ReactFormRatingContainer name="markStaff" label="Staff" />
          </div>
        </FormGroup>

        <FormGroup>
          <h4 className="mb-4">Comment?</h4>
          <Field name="comment" component={ReactFormInput} type="edit" size="md" />
        </FormGroup>

        <Button type="submit" disabled={pristine || submitting} size="md">Add</Button>
        <Button color="link" disabled={pristine || submitting} onClick={reset} size="md">Reset</Button>

      </form>
    );
  }
}

export default reduxForm({
  form: 'RateForm',
})(RateForm);
