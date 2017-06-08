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
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = { initialRate: null, mandatoryWarning: false, size: 26, style: null };

  render() {
    const {
      name,
      label,
      initialRate,
      mandatoryWarning,
      size,
      style,
      onChange,
    } = this.props;

    return (
      <FormGroup row color="danger" >
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
          {mandatoryWarning && !initialRate && <FormFeedback style={{marginTop: '-1rem'}} >(mandatory)</FormFeedback>}
        </Col>
      </FormGroup>
    );
  }
}

export default RatingStarsRow;