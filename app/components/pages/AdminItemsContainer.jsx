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
    items: PropTypes.object.isRequired, // load the object and not just the array (in the object) to get redux info (isSaving...)
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


  //
  // Alerting (for various actions: update, delete,...)
  //

  onStartUpdating = () => {
    this._nowStartUpdating = new Date().getTime();
    this.alert = Alert.info('Updating...');
  }

  onEndUpdatingOK = () => {
    const durationUpdating = new Date().getTime() - this._nowStartUpdating;
    this.alert = Alert.success(`Updated! (duration=${durationUpdating}ms)`);
  }

  onEndUpdatingFailed = (errorMessage) => {
    const durationUpdating = new Date().getTime() - this._nowStartUpdating;
    this.alert = Alert.error(`Error while updating (error=${errorMessage}, duration=${durationUpdating}ms)`);
  }


  onStartDeleting = () => {
    this._nowStartDeleting = new Date().getTime();
    this.alert = Alert.info('Deleting...');
  }

  onEndDeletingOK = () => {
    const durationDeleting = new Date().getTime() - this._nowStartDeleting;
    this.alert = Alert.success(`Deleted! (duration=${durationDeleting}ms)`);
  }

  onEndDeletingFailed = (errorMessage) => {
    const durationDeleting = new Date().getTime() - this._nowStartDeleting;
    this.alert = Alert.error(`Error while deleting (error=${errorMessage}, duration=${durationDeleting}ms)`);
  }




  //
  // Props update, here just for Alerting changes (from redux actions)
  //

  componentWillReceiveProps(nextProps) {
    console.log('AdminItemsContainer.componentWillReceiveProps - (nextProps, crtProps): ', nextProps, this.props);

    if (!nextProps || !nextProps.items || !this.props.items ) return;

    // End of updating? (status update switches from true to false)
    if (this.props.items.isUpdating === true && nextProps.items.isUpdating === false) {
      if (nextProps.items.error === null) this.onEndUpdatingOK();
      else this.onEndUpdatingFailed(nextProps.items.error);
    }

    // End of deleting? (status delete switches from true to false)
    if (this.props.items.isDeleting === true && nextProps.items.isDeleting === false) {
      if (nextProps.items.error === null) this.onEndDeletingOK();
      else this.onEndDeletingFailed(nextProps.items.error);
    }

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

  onDeleteModal(backupItemId) {
    this.setState({ modalEditItemOpened: false });
    console.log('AdminItemsContainer.onDeleteModal - backupItemId =', backupItemId);
    this.onStartDeleting();
    const { dispatch } = this.props;  // Injected by react-redux
    const action = itemsActions.deleteItem(this.state.currentItem.id, backupItemId);
    dispatch(action);
  }

  onCancelModal() {
    this.setState({ modalEditItemOpened: false });
  }


  render() {
    console.log('AdminItemsContainer.render - currentItem, currentKind, currentCategory = ', this.state.currentItem, this.state.currentKind, this.state.currentCategory);
    if (!this.props.items.items || !this.props.kinds || !this.props.categories) return null;

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
                {this.props.items.items.map((item, index) => {
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
            items={this.props.items.items}
            kinds={this.props.kinds}
            categories={this.props.categories}
            onUpdate={this.onUpdateModal.bind(this)}
            onDelete={this.onDeleteModal.bind(this)}
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
    items: state.items, // load the object and not just the array (in the object) to get redux info (isSaving...)
  };
};

export default connect(mapStateToProps)(AdminItemsContainer);
