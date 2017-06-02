/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Input, Modal, ModalHeader, ModalBody, ModalFooter, Row, Table } from 'reactstrap';
import SimpleListOrDropdown from '../pages/SimpleListOrDropdown';


class AdminItemModal extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    item: PropTypes.object.isRequired,
    kind: PropTypes.object.isRequired,
    category: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    kinds: PropTypes.array.isRequired,
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
    console.log('AdminItemModal.render - backupItemId = ', this.state.backupItemId);
    return (
      <Modal isOpen={this.props.open}>
        <ModalHeader>Edit Item</ModalHeader>
        <ModalBody>
          <Row className="mt-1">
            <Col xs={12} md={3} >
              <Button className="mb-3" color="danger" disabled={!this.state.backupItemId || this.state.backupItemId === ''} onClick={this.onDelete.bind(this)}>Delete!</Button>{' '}
            </Col>
            <Col xs={12} md={9} >
              <SimpleListOrDropdown items={this.props.items} dropdownPlaceholder="Orphan rates will be attached to:" selectedOption={this.state.backupItemId} onChange={this.onChangeBackupItem.bind(this)} dropdown />
            </Col>
          </Row>
          <Row className="mt-3">
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Current value</th>
                  <th>New value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Name</th>
                  <td>{this.props.item.name}</td>
                  <td><Input name="name" id="inputName" onChange={this.onChangeName.bind(this)} value={this.state.currentName} placeholder="..." required size="md" /></td>
                </tr>
                <tr>
                  <th scope="row">Kind</th>
                  <td>{this.props.kind.name}</td>
                  <td><SimpleListOrDropdown items={this.props.kinds} selectedOption={this.state.currentKind} onChange={this.onChangeKind.bind(this)} dropdown /></td>
                </tr>
                <tr>
                  <th scope="row">Category</th>
                  <td>{this.props.category.name}</td>
                  <td><SimpleListOrDropdown items={this.props.categories} selectedOption={this.state.currentCategory} onChange={this.onChangeCategory.bind(this)} dropdown /></td>
                </tr>
              </tbody>
            </Table>
          </Row>
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
