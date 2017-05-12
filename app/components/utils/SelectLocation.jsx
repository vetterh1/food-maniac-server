/* eslint-disable react/forbid-prop-types */

import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
import { Col, FormGroup } from 'reactstrap';
import ReactStrapInput from '../utils/ReactStrapInput';

const SelectLocation = props => (
  <div>
    <FormGroup row className="no-gutters">
      <Col xs={12}>
        <ReactStrapInput onChange={props.onChange} size="md">
          {props.places && props.places.map((place) => { return (<option key={place.id} value={place.id}>{place.name}</option>); })}
        </ReactStrapInput>
      </Col>
    </FormGroup>
  </div>
);

SelectLocation.propTypes = {
  places: PropTypes.array.isRequired,
  onChange: PropTypes.func,
};

SelectLocation.defaultProps = { onChange: null };

export default SelectLocation;
