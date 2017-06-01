/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Container, Input, Modal, ModalHeader, ModalBody, ModalFooter, Row, Table } from 'reactstrap';
import AdminOneItem from './AdminOneItem';
import SimpleListOrDropdown from '../pages/SimpleListOrDropdown';


class AdminItemModal extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    item: PropTypes.object.isRequired,
    kind: PropTypes.object.isRequired,
    category: PropTypes.object.isRequired,
    kinds: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      currentEditItem: null,
      currentName: null,
      currentKind: null,
      currentCategory: null,
      modalEditItemOpened: false,
      newName: null,
      newKind: null,
      newCategory: null,
    };
  }


  onChangeKind(event) {
    if (this.state.newKind === event.target.value) return;
    this.setState({ newKind: event.target.value });
  }

  onChangeCategory(event) {
    if (this.state.newCategory === event.target.value) return;
    this.setState({ newCategory: event.target.value });
  }

  onChangeName(event) {
    if (this.state.newName === event.target.value) return;
    this.setState({ newName: event.target.value });
  }


  onUpdate() {
    this.props.onUpdate();
  }


  onCancel() {
    this.props.onCancel();
  }



  // toggleEditItem() {
  //   const resetValues = { newName: this.props.item.name, newKind: this.state.currentEditKind.id, newCategory: this.state.currentEditCategory.id };
    
  //   this.setState({ modalEditItemOpened: !this.state.modalEditItemOpened });
  // }

  render() {
    // console.log('AdminItemModal.render - currentEditItem, currentKind, currentCategory = ', this.props.item, this.state.currentEditKind, this.state.currentEditCategory);
//      <Modal isOpen={this.props.open} toggle={this.toggleEditItem.bind(this)}>

    return (
      <Modal isOpen={this.props.open}>
        <ModalHeader>Edit Item</ModalHeader>
        <ModalBody>
          <Row className="mt-1">
          Delete {this.props.item.name}?
          </Row>
          <Row className="mt-1">
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
                  <td><Input name="name" id="inputName" onChange={this.onChangeName.bind(this)} value={this.state.newName} placeholder="..." required size="md" /></td>
                </tr>
                <tr>
                  <th scope="row">Kind</th>
                  <td>{this.props.kind.name}</td>
                  <td><SimpleListOrDropdown items={this.props.kinds} selectedOption={''} onChange={this.onChangeKind.bind(this)} dropdown /></td>
                </tr>
                <tr>
                  <th scope="row">Category</th>
                  <td>{this.props.category.name}</td>
                  <td><SimpleListOrDropdown items={this.props.categories} selectedOption={''} onChange={this.onChangeCategory.bind(this)} dropdown /></td>
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



/*
      <Modal isOpen={this.props.open} toggle={this.toggleEditItem.bind(this)}>
        <ModalHeader toggle={this.toggleEditItem.bind(this)}>Modal title</ModalHeader>
        <ModalBody>
          <Row className="mt-1">
          Delete {this.props.item.name}?
          </Row>
          <Row className="mt-1">
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
                  <td><Input name="name" id="inputName" onChange={this.onChangeName.bind(this)} value={this.state.newName} placeholder="..." required size="md" /></td>
                </tr>
                <tr>
                  <th scope="row">Kind</th>
                  <td>{this.state.currentEditKind.name}</td>
                  <td><SimpleListOrDropdown items={this.props.kinds} selectedOption={''} onChange={this.onChangeKind.bind(this)} dropdown /></td>
                </tr>
                <tr>
                  <th scope="row">Category</th>
                  <td>{this.state.currentEditCategory.name}</td>
                  <td><SimpleListOrDropdown items={this.props.categories} selectedOption={''} onChange={this.onChangeCategory.bind(this)} dropdown /></td>
                </tr>
              </tbody>
            </Table>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.toggleEditItem.bind(this)}>Do Something</Button>{' '}
          <Button color="secondary" onClick={this.toggleEditItem.bind(this)}>Cancel</Button>
        </ModalFooter>
      </Modal>
*/