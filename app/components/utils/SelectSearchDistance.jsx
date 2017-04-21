import React from 'react';
// import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import ReactFormInput from '../utils/ReactFormInput';

const SelectSearchDistance = () => {
  const distances = [
    { metres: 200, label: '200 metres' },
    { metres: 500, label: '500 metres' },
    { metres: 1000, label: '1 kilometre' },
    { metres: 5000, label: '5 kilometres' },
    { metres: 10000, label: '10 kilometres' },
    { metres: 50000, label: '50 kilometres' },
    { metres: 100000, label: '100 kilometres' },
    { metres: 500000, label: '500 kilometres' },
    { metres: 0, label: 'no restriction' },
  ];
  return (
    <Field name="searchDistance" component={ReactFormInput} type="select" size="md">
      {distances && distances.map((d) => { return (<option key={d.metres} value={d.metres}>{d.label}</option>); })}
    </Field>
  );
};

SelectSearchDistance.propTypes = {
};


SelectSearchDistance.defaultProps = {
};

export default SelectSearchDistance;
