/* eslint-disable react/forbid-prop-types */

import React from 'react';
import { Field } from 'redux-form';
import { Col, Label, FormGroup } from 'reactstrap';
import ReactFormRating from '../utils/ReactFormRating';


const styles = {
  markRate: {
  },
};


class ReactFormRatingContainer extends React.PureComponent {
  static propTypes = {
    name: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    size: React.PropTypes.number,
  };

  static defaultProps = { size: 26 };

  render() {
    return (
      <FormGroup row>
        <Col xs={3} lg={2} >
          <Label for={this.props.name} className="text-right">{this.props.label}</Label>
        </Col>
        <Col xs={9} lg={10} >
          <Field
            name={this.props.name}
            component={ReactFormRating}
            size={this.props.size}
            style={styles.markRate}
          />
        </Col>
      </FormGroup>
    );
  }
}

export default ReactFormRatingContainer;