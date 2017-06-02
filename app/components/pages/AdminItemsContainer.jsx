/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Row, Table } from 'reactstrap';
import Alert from 'react-s-alert';
import AdminOneItem from './AdminOneItem';
import AdminItemModal from './AdminItemModal';
import * as itemsActions from '../../actions/itemsActions';


class AdminItemsContainer extends React.Component {
  static propTypes = {
    // Injected by redux-store connect:
    items: PropTypes.array.isRequired,
    kinds: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    this.alert = null;

    this.state = {
      currentItem: null,
      currentKind: null,
      currentCategory: null,
      modalEditItemOpened: false,
    };
  }

  onStartUpdating = () => {
    this._nowStartUpdating = new Date().getTime();
    this.alert = Alert.info('Updating...');
  }

  onEndUpdatingOK = () => {
    const durationUpdating = new Date().getTime() - this._nowStartUpdating;
    this.alert = Alert.success(`Saved! (duration=${durationUpdating}ms)`);

    // Tell the child to reset
    // CAUTION! only works because the form is the immediate child
    // ...because it does NOT use redux not redux-form
    // if this CHANGES, this should be replaced by a dispatch or a reset action
    // ex: dispatch(reset('AddItemForm'));
    if (this._childComponent) this._childComponent.resetForm();
  }

  onEndUpdatingFailed = (errorMessage) => {
    const durationUpdating = new Date().getTime() - this._nowStartUpdating;
    this.alert = Alert.error(`Error while updating (error=${errorMessage}, duration=${durationUpdating}ms)`);
  }

  onItemClick(item, kind, category) {
    const currentItem = Object.assign({}, item);
    const currentKind = Object.assign({}, kind);
    const currentCategory = Object.assign({}, category);
    console.log('AdminItemsContainer.onItemClick - currentItem, currentKind, currentCategory =', currentItem, currentKind, currentCategory);
    this.setState({ modalEditItemOpened: true, currentItem, currentKind, currentCategory });
  }


  onUpdateModal(newState) {
    this.setState({ modalEditItemOpened: false });
    console.log('AdminItemsContainer.onUpdateModal - newState =', newState);
    this.onStartUpdating();
    const { dispatch } = this.props;  // Injected by react-redux
    const action = itemsActions.updateItem(this.state.currentItem.id, newState);
    dispatch(action);
  }

  onCancelModal() {
    this.setState({ modalEditItemOpened: false });
  }


  render() {
    console.log('AdminItemsContainer.render - currentItem, currentKind, currentCategory = ', this.state.currentItem, this.state.currentKind, this.state.currentCategory);
    if (!this.props.items || !this.props.kinds || !this.props.categories) return null;

    return (
      <div>
        <Container fluid>
          <Row className="mt-1">
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Id</th>
                  <th>Kind</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {this.props.items.map((item, index) => {
                  const kind = this.props.kinds.find((oneKind) => { return oneKind.id === item.kind; });
                  const category = this.props.categories.find((oneCategory) => { return oneCategory.id === item.category; });
                  return (<AdminOneItem item={item} index={index} key={item._id} kind={kind} category={category} onClick={this.onItemClick.bind(this)} />);
                })}
              </tbody>
            </Table>
          </Row>
        </Container>
        { (this.state.currentItem && this.state.currentKind && this.state.currentCategory) &&
          <AdminItemModal
            open={this.state.modalEditItemOpened}
            item={this.state.currentItem}
            kind={this.state.currentKind}
            category={this.state.currentCategory}
            kinds={this.props.kinds}
            categories={this.props.categories}
            onUpdate={this.onUpdateModal.bind(this)}
            onCancel={this.onCancelModal.bind(this)}
          />
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    kinds: state.kinds.kinds,
    categories: state.categories.categories,
    items: state.items.items,
  };
};

export default connect(mapStateToProps)(AdminItemsContainer);
