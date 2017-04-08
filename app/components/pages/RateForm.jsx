import React from 'react';
import { reduxForm } from 'redux-form';
import { Button, FormGroup } from 'reactstrap';
import ReactFormRatingContainer from '../utils/ReactFormRatingContainer';
import SelectLocation from '../utils/SelectLocation';
import ListItemsContainer from '../pages/ListItemsContainer';

const RateForm = (props) => {
  const { handleSubmit, pristine, reset, submitting } = props;
  return (
    <form onSubmit={handleSubmit}>
      <FormGroup>
        <h4 className="mb-4">What?</h4>
        <ListItemsContainer URL="/api/items" itemsPerPage={10} carrousel={false} />
      </FormGroup>

      <FormGroup>
        <h4 className="mb-4">Where?</h4>
        <SelectLocation />
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

      <Button type="submit" disabled={pristine || submitting} size="md">Add</Button>
      <Button color="link" disabled={pristine || submitting} onClick={reset} size="md">Reset</Button>

    </form>
  );
};

export default reduxForm({
  form: 'RateForm',
})(RateForm);
