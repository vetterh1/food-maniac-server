/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormGroup, FormFeedback } from 'reactstrap';
import Rating from 'react-rating';
import MdStar from 'react-icons/lib/md/star';
import MdStarOutline from 'react-icons/lib/md/star-outline';

class ReactFormRating extends React.PureComponent {
  static propTypes = {
    input: PropTypes.object,
    meta: PropTypes.shape({
      touched: PropTypes.bool,
      error: PropTypes.any,
    }),
    stop: PropTypes.number,
    size: PropTypes.number,
    style: PropTypes.object,
  };

  static defaultProps = { input: null, meta: null, stop: 5, size: 26, style: null };

  render() {
    const {
      input: {
        value,
        onChange,
      },
      meta: {
        touched,
        error,
      },
      stop,
      size,
      style,
    } = this.props;

    const classes = classNames({
      success: touched && !error,
      danger: touched && error,
    });

    return (
      <FormGroup color={classes}>
        <Rating
          initialRate={parseInt(value, 10)}
          onChange={rate => onChange(rate)}
          stop={stop}
          full={<MdStar size={size} />}
          empty={<MdStarOutline size={size} />}
          style={style}
        />
        {touched && error && <FormFeedback>{error}</FormFeedback>}
      </FormGroup>
    );
  }
}

export default ReactFormRating;