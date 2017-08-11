/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { Col, Label, FormFeedback, FormGroup } from 'reactstrap';
import RatingStars from '../utils/RatingStars';



class RatingStarsRow extends React.PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    initialRate: PropTypes.number,
    mandatoryWarning: PropTypes.bool,
    size: PropTypes.number,
    style: PropTypes.object,
    onChange: PropTypes.func,
    quantity: PropTypes.number,
    hideIfNoQuantity: PropTypes.bool,
  };

  static defaultProps = { initialRate: null, mandatoryWarning: false, size: 26, style: null, onChange: null, quantity: 0, hideIfNoQuantity: false };

  render() {
    const {
      name,
      label,
      initialRate,
      mandatoryWarning,
      quantity,
      hideIfNoQuantity,
      size,
      style,
      onChange,
    } = this.props;

    if (hideIfNoQuantity && (!quantity || quantity <= 0 || initialRate <= 0)) return null;

    return (
      <FormGroup row color="" >
        <Col xs={3} sm={2} >
          <Label for={name} className="text-right">{label}</Label>
        </Col>
        <Col xs={9} sm={10} >
          <RatingStars
            name={name}
            initialRate={initialRate}
            size={size}
            style={style}
            onChange={onChange}
          />
          { quantity > 0 && <Label className="ml-2">({quantity})</Label> }
          {mandatoryWarning && !initialRate && <FormFeedback style={{ marginTop: '-1rem' }} >(mandatory)</FormFeedback>}
        </Col>
      </FormGroup>
    );
  }
}

export default RatingStarsRow;