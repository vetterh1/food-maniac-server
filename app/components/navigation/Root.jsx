/* eslint-disable react/forbid-prop-types */

import * as log from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
import { connect, Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
// Older solution: Import bootstrap directly from cdn in index.html. no need for npm install bootstrap either!
import 'bootstrap/dist/css/bootstrap.min.css';
import { IntlProvider } from 'react-intl';
import { loglevelServerSend } from '../../utils/loglevel-serverSend';
import localeData from '../../locales/data.json';
import App from '../pages/App';
import MainPageContent from '../pages/MainPageContent';
import RateContainer from '../pages/RateContainer';
import SearchItemContainer from '../pages/SearchItemContainer';
import ListItemsContainerOld from '../pages/ListItemsContainerOld';
import ListItemsContainer from '../pages/ListItemsContainer';
import ListCategoriesContainer from '../pages/ListCategoriesContainer';
import ListKindsContainer from '../pages/ListKindsContainer';
import AdminItemsContainer from '../pages/AdminItemsContainer';
import About from '../pages/About';
import Callback from '../../auth/Callback';
import Auth from '../../auth/Auth';
import CheckoutContainer from '../checkout/CheckoutContainer';
import CheckoutComplete from '../checkout/CheckoutComplete';
import CheckoutAcqError from '../checkout/CheckoutAcqError';
import CheckoutUnknownError from '../checkout/CheckoutUnknownError';
import CheckoutCancelError from '../checkout/CheckoutCancelError';


const logRoot = log.getLogger('logRoot');
loglevelServerSend(logRoot); // a setLevel() MUST be run AFTER this!
logRoot.setLevel('debug');
logRoot.debug('--> entering Root.jsx');

const auth = new Auth();

const handleAuthentication = (nextState) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
};

const NotFound = () => <h2>404 error - This page is not found!</h2>;


class Root extends React.Component {
  constructor() {
    super();
    this.toggle = this.i18nLoad.bind(this);

    this.state = {
      locale: '',
      messages: [],
    };
  }

  // -------------------  i18n  ---------------------

  componentWillMount() {
    // 1st load and data already present in redux store
    // (loaded in index.jsx)
    this.i18nLoad(this.props.languageInfo);
  }

  componentWillReceiveProps(nextProps) {
    // Change language?
    if (nextProps &&
        nextProps.languageInfo &&
        nextProps.languageInfo.locale &&
        nextProps.languageInfo.locale !==
          this.props.languageInfo.locale) {
      this.i18nLoad(nextProps.languageInfo);
    }
  }

  // Retrieves messages for the current local (passed in parameters)
  // Set in the state, available to render(), can be passed to children
  i18nLoad(languageInfo) {
    if (!languageInfo) return;
    this.setState({
      locale: languageInfo.locale,
      messages: localeData[languageInfo.locale],
    });
  }


  render() {
    if (!this.props.languageInfo) return null;
    return (
      <Provider
        store={this.props.store}
      >
        <IntlProvider
          locale={this.state.locale}
          messages={this.state.messages}
        >
          <Router
            history={browserHistory}
          >
            <Route
              path="/"
              component={props => <App auth={auth} {...props} />}
            >
              <IndexRoute
                component={props => <MainPageContent auth={auth} {...props} />}
              />
              <Route
                path="/callback"
                component={(props) => {
                  handleAuthentication(props);
                  return <Callback {...props} />;
                }}
              />
              <Route
                path="/rate"
                component={props => <RateContainer auth={auth} {...props} />}
              />
              <Route
                path="/search"
                component={props => <SearchItemContainer auth={auth} {...props} />}
              />
              <Route
                path="/about"
                component={() => <About />}
              />
              <Route
                path="/listItems"
                component={props => <ListItemsContainer dropdown={false} auth={auth} {...props} />}
              />
              <Route
                path="/listItemsOld"
                component={props => (
                  <ListItemsContainerOld
                    URL="/api/items"
                    dropdown={false}
                    auth={auth}
                    {...props}
                  />)}
              />
              <Route
                path="/listCategories"
                component={props => <ListCategoriesContainer dropdown={false} auth={auth} {...props} />}
              />
              <Route
                path="/listKinds"
                component={props => <ListKindsContainer dropdown={false} auth={auth} {...props} />}
              />
              <Route
                path="/adminItems"
                component={props => <AdminItemsContainer auth={auth} {...props} />}
              />
              <Route
                path="/checkout"
                component={props => <CheckoutContainer />}
              />
              <Route
                path="/generateThumbnails"
                component={props => (
                  <ListItemsContainerOld
                    URL="/util/regenerateAllThumbnails"
                    socketName="regenerateAllThumbnails"
                    dropdown={false}
                    auth={auth}
                    {...props}
                  />)}
              />
              <Route
                path="/eshop-ok"
                component={props => <CheckoutComplete auth={auth} {...props} />}
              />              
              <Route
                path="/eshop-ko-acq"
                component={props => <CheckoutAcqError auth={auth} {...props} />}
              />              
              <Route
                path="/eshop-ko-unknown"
                component={props => <CheckoutUnknownError auth={auth} {...props} />}
              />              
              <Route
                path="/eshop-ko-cancel"
                component={props => <CheckoutCancelError auth={auth} {...props} />}
              />              
              <Route
                path="*"
                component={NotFound}
                auth={auth}
              />
            </Route>
          </Router>
        </IntlProvider>
      </Provider>
    );
  }
}


Root.propTypes = {
  store: PropTypes.object.isRequired,
  languageInfo: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return { languageInfo: state.languageInfo };
};

export default connect(mapStateToProps)(Root);