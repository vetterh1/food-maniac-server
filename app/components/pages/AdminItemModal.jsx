/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Col, Input, Modal, ModalHeader, ModalBody, ModalFooter, Row, Table } from 'reactstrap';
import SimpleListOrDropdown from '../pages/SimpleListOrDropdown';


class AdminItemModal extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    item: PropTypes.object.isRequired,
    kind: PropTypes.object.isRequired,
    category: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    kinds: PropTypes.array.isRequired,
    nbAggregateMarks: PropTypes.number.isRequired,
    categories: PropTypes.array.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      currentName: props.item.name,
      currentKind: props.kind.id,
      currentCategory: props.category.id,
      backupItemId: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps) return;
    this.setState({
      currentName: nextProps.item.name,
      currentKind: nextProps.kind.id,
      currentCategory: nextProps.category.id,
      backupItemId: '',
    });
  }

  onChangeKind(event) {
    if (this.state.currentKind === event.target.value) return;
    this.setState({ currentKind: event.target.value });
  }

  onChangeCategory(event) {
    if (this.state.currentCategory === event.target.value) return;
    this.setState({ currentCategory: event.target.value });
  }

  onChangeName(event) {
    if (this.state.currentName === event.target.value) return;
    this.setState({ currentName: event.target.value });
  }

  onChangeBackupItem(event) {
    if (this.state.backupItemId === event.target.value) return;
    this.setState({ backupItemId: event.target.value });
  }

  onUpdate() {
    const updates = {};
    if (this.state.currentName !== this.props.item.name) updates.name = this.state.currentName;
    if (this.state.currentKind !== this.props.kind.id) updates.kind = this.state.currentKind;
    if (this.state.currentCategory !== this.props.category.id) updates.category = this.state.currentCategory;
    this.props.onUpdate(updates);
  }

  onDelete() {
    this.props.onDelete(this.state.backupItemId);
  }


  onCancel() {
    this.props.onCancel();
  }


  render() {
    const possibleBackupItems = this.props.items.filter((item) => {return item.id !== this.props.item.id})
    console.log('AdminItemModal.render - backupItemId = ', this.state.backupItemId);
    return (
      <Modal isOpen={this.props.open}>
        <ModalHeader>Edit item</ModalHeader>
        <ModalBody>
          <Container fluid>
            <Row className="mt-2"><h5>Information:</h5></Row>
            <Row className="mt-3">
              <Col xs={12} md={6} >Item name:</Col>
              <Col xs={12} md={6} ><em>{this.props.item.name}</em></Col>
            </Row>
            <Row className="mt-2">
              <Col xs={12} md={6} >Nb aggr. marks linked:</Col>
              <Col xs={12} md={6} ><em>{this.props.nbAggregateMarks}</em></Col>
            </Row>

            <Row className="mt-5"><h5>Delete:</h5></Row>
            <Row className="mt-3">
              <Col xs={12} md={9} >
                <SimpleListOrDropdown items={possibleBackupItems} dropdownPlaceholder="Orphan rates will be attached to:" selectedOption={this.state.backupItemId} onChange={this.onChangeBackupItem.bind(this)} dropdown />
              </Col>
              <Col xs={12} md={3} >
                <Button className="mb-3" color="danger" disabled={!this.state.backupItemId || this.state.backupItemId === ''} onClick={this.onDelete.bind(this)}>Delete!</Button>{' '}
              </Col>
            </Row>
            <Row className="mt-5"><h5>Update:</h5></Row>
            <Row className="mt-3">
              <Table responsive>
                <thead>
                  <tr>
                    <th>&nbsp;</th>
                    <th>Current value</th>
                    <th>New value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Name</td>
                    <td><em>{this.props.item.name}</em></td>
                    <td><Input name="name" id="inputName" onChange={this.onChangeName.bind(this)} value={this.state.currentName} placeholder="..." required size="md" /></td>
                  </tr>
                  <tr>
                    <td>Kind</td>
                    <td><em>{this.props.kind.name}</em></td>
                    <td><SimpleListOrDropdown items={this.props.kinds} selectedOption={this.state.currentKind} onChange={this.onChangeKind.bind(this)} dropdown /></td>
                  </tr>
                  <tr>
                    <td>Category</td>
                    <td><em>{this.props.category.name}</em></td>
                    <td><SimpleListOrDropdown items={this.props.categories} selectedOption={this.state.currentCategory} onChange={this.onChangeCategory.bind(this)} dropdown /></td>
                  </tr>
                </tbody>
              </Table>
            </Row>
          </Container>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.onUpdate.bind(this)}>Update!</Button>{' '}
          <Button color="secondary" onClick={this.onCancel.bind(this)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default AdminItemModal;
