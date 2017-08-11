/* eslint-disable react/forbid-prop-types */

import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
import { Row } from 'reactstrap';

export default class ListOneIndividualMark extends React.Component {

  static propTypes = {
    markIndividual: PropTypes.object.isRequired,
  };

  render() {
    const { markIndividual } = this.props;

    if (!markIndividual) return null;
    if (!markIndividual.comment) return null;
    if (markIndividual.comment === '') return null;

    const comment = markIndividual.comment.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
    const arrayDateTime = markIndividual.lastModif.split('T');

    return (
      <Row className="result-item-individual-mark py-1" noGutters>
        <i>{arrayDateTime[0]}:&nbsp;</i>{comment}
      </Row>
    );
  }

}

ListOneIndividualMark.defaultProps = { markIndividual: null };
