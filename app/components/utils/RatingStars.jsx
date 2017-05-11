/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormFeedback } from 'reactstrap';
import Rating from 'react-rating';
import MdStar from 'react-icons/lib/md/star';
import MdStarOutline from 'react-icons/lib/md/star-outline';

class RatingStars extends React.PureComponent {
  static propTypes = {
    initialValue: PropTypes.number,
    stop: PropTypes.number,
    size: PropTypes.number,
    style: PropTypes.object,
    onChange: PropTypes.func,
  };

  static defaultProps = { initialValue: null, stop: 5, size: 26, style: null };

  render() {
    const {
      initialValue,
      stop,
      size,
      style,
      onChange
    } = this.props;

    return (
      <FormGroup>
        <Rating
          initialRate={initialValue ? parseInt(initialValue, 10) : null}
          onChange={rate => onChange(rate)}
          stop={stop}
          full={<MdStar size={size} />}
          empty={<MdStarOutline size={size} />}
          style={style}
        />
      </FormGroup>
    );
  }
}

export default RatingStars;