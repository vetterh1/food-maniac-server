/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { Col, Label, FormGroup } from 'reactstrap';
import RatingStars from '../utils/RatingStars';



class RatingStarsRow extends React.PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    initialValue: PropTypes.number,
    size: PropTypes.number,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = { size: 26 };

  render() {
    const {
      name,
      label,
      initialValue,
      size,
      style,
      onChange,
    } = this.props;

    return (
      <FormGroup row>
        <Col xs={3} lg={2} >
          <Label for={name} className="text-right">{label}</Label>
        </Col>
        <Col xs={9} lg={10} >
          <RatingStars
            name={name}
            initialValue={initialValue}
            size={size}
            style={style}
            onChange={onChange}
          />
        </Col>
      </FormGroup>
    );
  }
}

export default RatingStarsRow;