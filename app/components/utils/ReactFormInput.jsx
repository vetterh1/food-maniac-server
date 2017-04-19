/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormGroup, Input, FormFeedback } from 'reactstrap';

class reactFormInput extends React.PureComponent {
  static propTypes = {
    input: PropTypes.object,
    placeholder: PropTypes.string,
    type: PropTypes.string.isRequired,
    meta: PropTypes.shape({
      touched: PropTypes.bool,
      error: PropTypes.any,
    }),
    children: PropTypes.array,
  };

  static defaultProps = { input: null, placeholder: null, meta: null, children: null };

  render() {
    const {
      input,
      placeholder,
      type,
      meta: {
        touched,
        error,
      },
      children,
    } = this.props;

    const classes = classNames({
      success: touched && !error,
      danger: touched && error,
    });

    return (
      <FormGroup color={classes}>
        <Input {...input} type={type} placeholder={placeholder} state={classes}>
          {children}
        </Input>
        {touched && error && <FormFeedback>{error}</FormFeedback>}
      </FormGroup>
    );
  }
}

export default reactFormInput;