/* eslint-disable react/forbid-prop-types */

import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
import ReactStrapInput from '../utils/ReactStrapInput';

const logListItems = log.getLogger('logListItems');
logListItems.setLevel('warn');
logListItems.debug('--> entering ListItems.jsx');



class ListOneItem extends React.Component {

  static propTypes = {
    item: PropTypes.object.isRequired,
  }

  render() {
    return (<li>{this.props.item.name}</li>);
  }
}




class ListItems extends React.Component {
  static propTypes = {
    dropdown: PropTypes.bool.isRequired,
    items: PropTypes.array.isRequired,
    onChange: PropTypes.func,
  }

  render() {
    return (
      <div>
        { !this.props.dropdown &&
          <ul>
            {this.props.items.map((item, index) => (
              <ListOneItem index={index} item={item} key={item._id} />
            ))}
          </ul>
        }
        { this.props.dropdown &&
          <ReactStrapInput onChange={this.props.onChange} size="md">
            {this.props.items && this.props.items.map((item) => { return (<option key={item._id} value={item._id}>{item.name}</option>); })}
          </ReactStrapInput>
        }
      </div>
    );
  }

}

ListItems.defaultProps = { dropdown: false, onChange: null };


export default ListItems;
