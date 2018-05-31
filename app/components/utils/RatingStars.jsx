/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import Rating from 'react-rating';
import MdStar from 'react-icons/lib/md/star';
import MdStarOutline from 'react-icons/lib/md/star-outline';

class RatingStars extends React.PureComponent {
  static propTypes = {
    initialRate: PropTypes.number,
    stop: PropTypes.number,
    size: PropTypes.number,
    style: PropTypes.object,
    onChange: PropTypes.func,
    className: PropTypes.string,
  };

  static defaultProps = { initialRate: null, stop: 5, size: 26, style: null, onChange: null, className: '' };

  render() {
    const {
      initialRate,
      stop,
      size,
      style,
      onChange,
      className,
    } = this.props;

    return (
      <span className={className} >
        <Rating
          initialRating={initialRate}
          onChange={rate => onChange && onChange(rate)}
          stop={stop}
          fullSymbol={<MdStar size={size} />}
          emptySymbol={<MdStarOutline size={size} />}
          style={style}
          readonly={!onChange}
          fractions={onChange ? 1 : 2}
        />
      </span>
    );
  }
}

export default RatingStars;