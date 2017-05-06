import React from 'react';
import PropTypes from 'prop-types';
import ReactStrapInput from '../utils/ReactStrapInput';

const SelectSearchDistance = (props) => {
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
    <ReactStrapInput onChange={props.onChange} size="md">
      {distances && distances.map((d) => { return (<option key={d.metres} value={d.metres}>{d.label}</option>); })}
    </ReactStrapInput>
  );
};

SelectSearchDistance.propTypes = {
  onChange: PropTypes.func.isRequired,
};

SelectSearchDistance.defaultProps = { onChange: null };


export default SelectSearchDistance;
