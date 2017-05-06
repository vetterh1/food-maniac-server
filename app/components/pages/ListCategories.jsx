/* eslint-disable react/forbid-prop-types */

import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
import ReactStrapInput from '../utils/ReactStrapInput';

const logListCategories = log.getLogger('logListCategories');
logListCategories.setLevel('warn');
logListCategories.debug('--> entering ListCategories.jsx');



class ListOneCategory extends React.Component {

  static propTypes = {
    category: PropTypes.object.isRequired,
  }

  render() {
    return (<li>{this.props.category.name}</li>);
  }
}




class ListCategories extends React.Component {
  static propTypes = {
    dropdown: PropTypes.bool.isRequired,
    categories: PropTypes.array.isRequired,
    onChange: PropTypes.func,
  }

  render() {
    return (
      <div>
        { !this.props.dropdown &&
          <ul>
            {this.props.categories.map((category, index) => (
              <ListOneCategory index={index} category={category} key={category._id} />
            ))}
          </ul>
        }
        { this.props.dropdown &&
          <ReactStrapInput onChange={this.props.onChange} size="md">
            {this.props.categories && this.props.categories.map((category) => { return (<option key={category._id} value={category._id}>{category.name}</option>); })}
          </ReactStrapInput>
        }
      </div>
    );
  }

}

ListCategories.defaultProps = { dropdown: false, onChange: null };


export default ListCategories;
