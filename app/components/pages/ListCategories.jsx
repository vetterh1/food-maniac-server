import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import ReactFormInput from '../utils/ReactFormInput';

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
          <Field name="category" component={ReactFormInput} type="select" size="md">
            {this.props.categories && this.props.categories.map((category) => { return (<option key={category._id} value={category._id}>{category.name}</option>); })}
          </Field>
        }
      </div>
    );
  }

}



export default ListCategories;
