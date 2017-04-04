/* eslint-disable react/prop-types */

import React from 'react';
import Rating from 'react-rating';

const ReactFormRating = ({ input, ...rest }) => (
  <Rating
    {...input}
    {...rest}
    initialRate={input.value}
    onChange={rate => input.onChange(rate)}
  />
);

export default ReactFormRating;