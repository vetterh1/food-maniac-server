import React from 'react';
import { reduxForm } from 'redux-form';
import { Button, Col, FormGroup } from 'reactstrap';
import ListItemsContainer from '../pages/ListItemsContainer';
import SelectSearchDistance from '../utils/SelectSearchDistance';
import Geolocation from '../utils/Geolocation';

const SearchItemForm = (props) => {
  const { handleSubmit, pristine, reset, submitting, onSearchItemError } = props;
  return (
    <form onSubmit={handleSubmit}>
      <FormGroup>
        <h4 className="mb-4">What?</h4>
        <ListItemsContainer URL="/api/items" itemsPerPage={10} carrousel={false} onSearchItemError={onSearchItemError}/>
      </FormGroup>
      <FormGroup>
        <h4 className="mb-4">Max distance?</h4>
        <FormGroup row className="no-gutters">
          <Col xs={11}>
            <SelectSearchDistance />
          </Col>
          <Col xs={1}>
            <Geolocation />
          </Col>
        </FormGroup>
      </FormGroup>
      <Button type="submit" disabled={pristine || submitting} size="md">Find</Button>
    </form>
  );
};

export default reduxForm({
  form: 'SearchItemForm',
})(SearchItemForm);
