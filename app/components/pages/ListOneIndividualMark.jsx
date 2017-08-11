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
    const { markIndividual } = this.props;

    if (!markIndividual) return null;
    if (!markIndividual.comment) return null;
    if (markIndividual.comment === '') return null;

    const arrayDateTime = markIndividual.lastModif.split('T');

    return (
      <Row className="result-item-individual-mark py-1" noGutters>
        {arrayDateTime[0]}:<br />{markIndividual.comment}
      </Row>
    );
  }

}

ListOneIndividualMark.defaultProps = { markIndividual: null };
