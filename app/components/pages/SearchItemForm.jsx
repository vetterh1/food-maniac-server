/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup } from 'reactstrap';
import SimpleListOrDropdown from '../utils/SimpleListOrDropdown';
import SelectItemPlus from '../utils/SelectItemPlus';

const styles = {
  form: {
    // width: 300,
    // margin: '20 auto',
    padding: 20,
  },
};

class SearchItemForm extends React.Component {
  static propTypes = {
    kinds: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    items: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    console.log('SearchItemForm constructor props: ', props);

    this._refSelectItemPlus = null; // used to reset the 3 dropdowns

    this.defaultState = {
      // unique key for the form --> used for reset form
      keyForm: Date.now(),

      item: null,
      distance: '500',
    };

    this.state = {
      ...this.defaultState,
    };
  }

  onSubmit(event) {
    event.preventDefault();

    const returnValue = {
      item: this.state.item,
      distance: this.state.distance,
    };
    this.refSubmit.blur();
    this.props.onSubmit(returnValue);
  }


  onChangeItem(item) {
    if (this.state.item === item) return;
    this.setState({ item });
  }


  onChangeDistance(event) {
    if (this.state.distance === event.target.value) return;
    this.setState({ distance: event.target.value });
  }

  getPredifinedDistances() {
    return [
      { id: '200', name: '200 metres' },
      { id: '500', name: '500 metres' },
      { id: '1000', name: '1 kilometre' },
      { id: '5000', name: '5 kilometres' },
      { id: '10000', name: '10 kilometres' },
      { id: '50000', name: '50 kilometres' },
      { id: '100000', name: '100 kilometres' },
      { id: '500000', name: '500 kilometres' },
      { id: '0', name: 'no restriction' },
    ];
  }

  resetForm() {
    // Reset the form & clear the image
    this.setState(Object.assign({}, this.defaultState));
    this._refSelectItemPlus.reset();
    this.refReset.blur();
    window.scrollTo(0, 0);
    this.props.resetForm();
  }

  render() {
    console.log('render SearchItemForm: (category, kind, item)=', this.state.category, this.state.kind, this.state.item);
    const formReadyForSubmit = this.state.item && this.state.distance;
    return (
      <div style={styles.form}>
        <h3 className="mb-4">Search dish...</h3>
        <Form onSubmit={this.onSubmit.bind(this)}>
          <SelectItemPlus
            title="What?"
            kinds={this.props.kinds}
            categories={this.props.categories}
            items={this.props.items}
            onChange={this.onChangeItem.bind(this)}
            ref={(r) => { this._refSelectItemPlus = r; }} // used to reset the 3 dropdowns
          />
          <FormGroup>
            <h5 className="mb-4">Max distance?</h5>
            <FormGroup row className="no-gutters">
              <SimpleListOrDropdown items={this.getPredifinedDistances()} selectedOption={this.state.distance} onChange={this.onChangeDistance.bind(this)} dropdown />
            </FormGroup>
          </FormGroup>

          <Button type="submit" size="md" disabled={!formReadyForSubmit} getRef={(ref) => { this.refSubmit = ref; }} >Find</Button>
          <Button color="link" onClick={this.resetForm.bind(this)} size="md" getRef={(ref) => { this.refReset = ref; }}>Reset</Button>
        </Form>
      </div>
    );
  }
}

export default SearchItemForm;
