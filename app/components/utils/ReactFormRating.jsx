/* eslint-disable react/forbid-prop-types */

import React from 'react';
import classNames from 'classnames';
import { FormGroup, FormFeedback } from 'reactstrap';
import Rating from 'react-rating';
import MdStar from 'react-icons/lib/md/star';
import MdStarOutline from 'react-icons/lib/md/star-outline';

class ReactFormRating extends React.PureComponent {
  static propTypes = {
    input: React.PropTypes.object,
    meta: React.PropTypes.shape({
      touched: React.PropTypes.bool,
      error: React.PropTypes.any,
    }),
    stop: React.PropTypes.number,
    size: React.PropTypes.number,
    style: React.PropTypes.object,
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