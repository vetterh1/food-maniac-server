/* eslint-disable no-class-assign */
/* eslint-disable react/forbid-prop-types */

import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Alert from 'react-s-alert';
import AddItemModal from './AddItemModal';
import * as itemsActions from '../../actions/itemsActions';
// import stringifyOnce from '../../utils/stringifyOnce';

// require('es6-promise').polyfill();
// require('isomorphic-fetch');
import { polyfill } from 'es6-promise';
import 'isomorphic-fetch';

const logAddItemContainer = log.getLogger('logAddItemContainer');
logAddItemContainer.setLevel('warn');
logAddItemContainer.debug('--> entering AddItemContainer.jsx');

class AddItemContainer extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    // Injected by redux-store connect:
    kinds: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    items: PropTypes.object.isRequired, // load the object and not just the array (in the object) to get redux info (isSaving...)
    locale: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.values = null;

    this._childComponent = null;

    this.alert = null;
  }

  componentWillReceiveProps(nextProps) {
    console.log('AddItemContainer.componentWillReceiveProps - (nextProps, crtProps): ', nextProps, this.props);

    // Only consider the end of saving:
    // previous isSaving = true and
    // new isSaving = false
    if (!nextProps ||
      !nextProps.items ||
      !this.props.items ||
      this.props.items.isSaving !== true ||
      nextProps.items.isSaving !== false) return;

    if (nextProps.items.error === null) this.onEndSavingOK();
    else this.onEndSavingFailed(nextProps.items.error);
  }


  onCancel() {
    this.props.onClose();
  }


  onSubmit(data) {
    this.onStartSaving();
    const { dispatch } = this.props;  // Injected by react-redux
    const action = itemsActions.saveItem(data);
    dispatch(action);
    this.props.onClose();
}


  onStartSaving = () => {
    this._nowStartSaving = new Date().getTime();
    const msg = this.context.intl.formatMessage({ id: 'messages.save.start' });
    this.alert = Alert.info(msg);
  }

  onEndSavingOK = () => {
    const duration = new Date().getTime() - this._nowStartSaving;
    const msg = this.context.intl.formatMessage({ id: 'messages.save.success' }, { duration });
    if (this.alert) Alert.update(this.alert, msg, 'success');
    else this.alert = Alert.success(msg);
  }

  onEndSavingFailed = (errorMessage) => {
    const duration = new Date().getTime() - this._nowStartSaving;
    const msg = this.context.intl.formatMessage({ id: 'messages.save.error' }, { errorMessage, duration });
    if (this.alert) Alert.update(this.alert, msg, 'error');
    else this.alert = Alert.error(msg);
  }

  onSnapshotStartProcessing = () => {
    this._nowStartProcessing = new Date().getTime();
    this.alert = Alert.info('Processing snapshot...');
    const msg = this.context.intl.formatMessage({ id: 'messages.snapshot.start' });
    if (this.alert) Alert.update(this.alert, msg, 'info');
    else this.alert = Alert.info(msg);
}

  onSnapshotError = (errorMessage) => {
    const duration = new Date().getTime() - this._nowStartProcessing;
    const msg = this.context.intl.formatMessage({ id: 'messages.snapshot.error' }, { errorMessage, duration });
    if (this.alert) Alert.update(this.alert, msg, 'error');
    else this.alert = Alert.error(msg);
  }

  onSnapshotReady = () => {
    const duration = new Date().getTime() - this._nowStartProcessing;
    const msg = this.context.intl.formatMessage({ id: 'messages.snapshot.success' }, { duration });
    if (this.alert) Alert.update(this.alert, msg, 'success');
    else this.alert = Alert.success(msg);
  }


  render() {
    return (
      <AddItemModal
        locale={this.props.locale}
        ref={(r) => { this._childComponent = r; }}
        open={this.props.open}
        kinds={this.props.kinds}
        categories={this.props.categories}
        items={this.props.items.items}
        onSubmit={this.onSubmit.bind(this)}
        onCancel={this.onCancel.bind(this)}
        onSnapshotStartProcessing={this.onSnapshotStartProcessing}
        onSnapshotError={this.onSnapshotError}
        onSnapshotReady={this.onSnapshotReady}
      />
    );
  }

}

AddItemContainer.contextTypes = { intl: React.PropTypes.object.isRequired };

const mapStateToProps = (state) => {
  // Add the All to the Kind & Category lists
  return {
    kinds: state.kinds.kinds,
    categories: state.categories.categories,
    items: state.items, // load the object and not just the array (in the object) to get redux info (isSaving...)
    locale: state.languageInfo.locale,
  };
};

AddItemContainer = connect(mapStateToProps)(AddItemContainer);
export default AddItemContainer;
