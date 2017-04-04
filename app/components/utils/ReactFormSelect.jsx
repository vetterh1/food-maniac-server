/* eslint-disable react/prop-types */
/* eslint-disable react/no-children */

import React from 'react';
import { Input } from 'reactstrap';

const reactFormSelect = ({ input, label, meta: { touched, error }, children, ...custom }) => (
  <Input
    type="select"
    {...input}
    onChange={(event, index, value) => input.onChange(value)}
    children={children}
    {...custom}
  />
);

export default reactFormSelect;