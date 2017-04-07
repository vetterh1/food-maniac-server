import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { Col, Button, Label, FormGroup } from 'reactstrap';
import ReactFormRating from '../utils/ReactFormRating';
import SelectLocation from '../utils/SelectLocation';
import ListItemsContainer from '../pages/ListItemsContainer';


const styles = {
  form: {
    // width: 300,
    // margin: '20 auto',
    padding: 20,
  },
  imageCameraSnapshot: {
    maxWidth: 300,
    maxHeight: 200,
  },
  switchStyle: {
    marginBottom: 16,
  },
  submitStyle: {
    marginTop: 32,
  },

  markContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  markLine: {
    padding: '1em',
  },
  markLabel: {
  },
  markRate: {
  },
};

const RateForm = (props) => {
  const { handleSubmit, pristine, reset, submitting } = props;
  return (
    <form
      // key={this.state.keyForm}  // unique key that let reset the form by changing the state keyForm
      // onValid={this.enableButton}
      // onInvalid={this.disableButton}
      onSubmit={handleSubmit}
      // onInvalidSubmit={this.notifyFormError}
      // model={defaultValues}
    >
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
          <FormGroup row>
            <Col xs={3} lg={2} >
              <Label for="markOverall" className="text-right">Overall</Label>
            </Col>
            <Col xs={9} lg={10} >
              <Field
                name="markOverall"
                component={ReactFormRating}
                size={30}
                style={styles.markRate}
              />
            </Col>
          </FormGroup>

          <FormGroup row>
            <Col xs={3} lg={2} >
              <Label for="markQuality" className="text-right">Quality</Label>
            </Col>
            <Col xs={9} lg={10} >
              <Field
                name="markQuality"
                component={ReactFormRating}
                style={styles.markRate}
              />
            </Col>
          </FormGroup>

          <FormGroup row>
            <Col xs={3} lg={2} >
              <Label for="markPlace" className="text-right">Place</Label>
            </Col>
            <Col xs={9} lg={10} >
              <Field
                name="markPlace"
                component={ReactFormRating}
                style={styles.markRate}
              />
            </Col>
          </FormGroup>

          <FormGroup row>
            <Col xs={3} lg={2} >
              <Label for="markStaff" className="text-right">Staff</Label>
            </Col>
            <Col xs={9} lg={10} >
              <Field
                name="markStaff"
                component={ReactFormRating}
                style={styles.markRate}
              />
            </Col>
          </FormGroup>
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
