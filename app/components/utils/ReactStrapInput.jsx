/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Input, FormFeedback } from 'reactstrap';

class ReactStrapInput extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    children: PropTypes.array,
  };

  static defaultProps = { children: null };

  render() {
    const {
      children,
    } = this.props;

    return (
      <FormGroup>
        <Input type="select" name="select" id="exampleSelect" onChange={this.props.onChange} >
          {children}
        </Input>
      </FormGroup>
    );
  }
}

export default ReactStrapInput;