/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import ReactStrapInput from '../utils/ReactStrapInput';


const ListOneKind = props => (
  <li>{props.kind.name}</li>
);

ListOneKind.propTypes = {
  kind: PropTypes.object.isRequired,
};



const ListKinds = props => (
  <div>
    { !props.dropdown &&
      <ul>
        {props.kinds.map((kind, index) => (
          <ListOneKind index={index} kind={kind} key={kind._id} />
        ))}
      </ul>
    }
    { props.dropdown &&
      <ReactStrapInput selectedOption={props.selectedOption} onChange={props.onChange} size="md">
        {props.kinds && props.kinds.map((kind) => { return (<option key={kind._id} value={kind._id}>{kind.name}</option>); })}
      </ReactStrapInput>
    }
  </div>
);

ListKinds.propTypes = {
  dropdown: PropTypes.bool.isRequired,
  kinds: PropTypes.array.isRequired,
  selectedOption: React.PropTypes.string,
  onChange: PropTypes.func,
};

ListKinds.defaultProps = {
  dropdown: false,
  selectedOption: null,
  onChange: null,
};


export default ListKinds;
