/* eslint-disable react/forbid-prop-types */

import React from 'react';
import classNames from 'classnames';
import { FormGroup, Input, FormFeedback } from 'reactstrap';

class reactFormInput extends React.PureComponent {
  static propTypes = {
    input: React.PropTypes.object,
    placeholder: React.PropTypes.string,
    type: React.PropTypes.string.isRequired,
    meta: React.PropTypes.shape({
      touched: React.PropTypes.bool,
      error: React.PropTypes.any,
    }),
    children: React.PropTypes.array,
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