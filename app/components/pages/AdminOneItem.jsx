/* eslint-disable react/forbid-prop-types */

import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
// import { Row } from 'reactstrap';
import { loglevelServerSend } from '../../utils/loglevel-serverSend';

const logAdminOneItem = log.getLogger('logAdminOneItem');
loglevelServerSend(logAdminOneItem); // a setLevel() MUST be run AFTER this!
logAdminOneItem.setLevel('debug');

class AdminOneItem extends React.Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    kind: PropTypes.object.isRequired,
    category: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  onClick() {
    console.log('AdminOneItem.onClick on ', this.props.item.name, this.props.kind, this.props.category);
    this.props.onClick(this.props.item, this.props.kind, this.props.category);
  }

  render() {
    const { item, kind, category } = this.props;
    return (
      <tr onClick={this.onClick.bind(this)}>
        <th scope="row">{item.name}</th>
        <td>{item.id}</td>
        <td>{kind.name}</td>
        <td>{category.name}</td>
      </tr>
    );
  }
}

export default AdminOneItem;
