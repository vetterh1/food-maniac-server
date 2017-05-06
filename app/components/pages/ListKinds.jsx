/* eslint-disable react/forbid-prop-types */

import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
import ReactStrapInput from '../utils/ReactStrapInput';

const logListKinds = log.getLogger('logListKinds');
logListKinds.setLevel('warn');
logListKinds.debug('--> entering ListKinds.jsx');



class ListOneKind extends React.Component {

  static propTypes = {
    kind: PropTypes.object.isRequired,
  }

  render() {
    return (<li>{this.props.kind.name}</li>);
  }
}




class ListKinds extends React.Component {
  static propTypes = {
    dropdown: PropTypes.bool,
    kinds: PropTypes.array.isRequired,
    onChange: PropTypes.func,
  }

  render() {
    return (
      <div>
        { !this.props.dropdown &&
          <ul>
            {this.props.kinds.map((kind, index) => (
              <ListOneKind index={index} kind={kind} key={kind._id} />
            ))}
          </ul>
        }
        { this.props.dropdown &&
          <ReactStrapInput onChange={this.props.onChange} size="md">
            {this.props.kinds && this.props.kinds.map((kind) => { return (<option key={kind._id} value={kind._id}>{kind.name}</option>); })}
          </ReactStrapInput>
        }
      </div>
    );
  }

}

ListKinds.defaultProps = { dropdown: false, onChange: null };


export default ListKinds;
