/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Input } from 'reactstrap';

const ReactStrapInput = props => (
  <FormGroup>
    <Input type="select" name="select" id="exampleSelect" value={props.selectedOption} onChange={props.onChange} >
      {props.children}
    </Input>
  </FormGroup>
);

ReactStrapInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  selectedOption: PropTypes.string,
  children: PropTypes.array,
};

ReactStrapInput.defaultProps = {
  selectedOption: null,
  children: null,
};

export default ReactStrapInput;