import React from 'react';
import { reduxForm } from 'redux-form';
import { Button, FormGroup } from 'reactstrap';
import ListItemsContainer from '../pages/ListItemsContainer';
import SelectSearchDistance from '../utils/SelectSearchDistance';

const FindItemsForm = (props) => {
  const { handleSubmit, pristine, reset, submitting } = props;
  return (
    <form onSubmit={handleSubmit}>
      <FormGroup>
        <h4 className="mb-4">What?</h4>
        <ListItemsContainer URL="/api/items" itemsPerPage={10} carrousel={false} />
      </FormGroup>
      <FormGroup>
        <h4 className="mb-4">Max distance?</h4>
        <SelectSearchDistance />
      </FormGroup>
      <Button type="submit" disabled={pristine || submitting} size="md">Find</Button>
    </form>
  );
};

export default reduxForm({
  form: 'FindItemsForm',
})(FindItemsForm);
