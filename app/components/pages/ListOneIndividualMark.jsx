/* eslint-disable react/forbid-prop-types */

import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row } from 'reactstrap';

export default class ListOneIndividualMark extends React.Component {

  static propTypes = {
    markIndividual: PropTypes.object.isRequired,
    // index: PropTypes.number.isRequired,
    // key: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
    };
  }


  render() {
    if (!this.props.markIndividual) return null;

    const { markIndividual } = this.props;

    return (
      <Row className="result-item-individual-mark py-0" noGutters>
        comments: {markIndividual.comment}
      </Row>
    );
  }

}

ListOneIndividualMark.defaultProps = { markIndividual: null };
