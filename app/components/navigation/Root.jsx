/* eslint-disable react/forbid-prop-types */

import React, { PropTypes } from 'react';
import { connect, Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
// Import bootstrap directly from cdn in index.html. no need for npm install bootstrap either!
// import 'bootstrap/dist/css/bootstrap.min.css';
import { IntlProvider } from 'react-intl';
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
              component={App}
            >
              <IndexRoute
                component={MainPageContent}
              />
              <Route
                path="/rate"
                component={RateContainer}
              />
              <Route
                path="/searchItem"
                component={SearchItemContainer}
              />
              <Route
                path="/listItems"
                component={() => (
                  <ListItemsContainer
                    dropdown={false}
                  />)}
              />
              <Route
                path="/listItemsOld"
                component={() => (
                  <ListItemsContainerOld
                    URL="/api/items"
                    dropdown={false}
                  />)}
              />
              <Route
                path="/listCategories"
                component={() => (
                  <ListCategoriesContainer
                    dropdown={false}
                  />)}
              />
              <Route
                path="/listKinds"
                component={() => (
                  <ListKindsContainer
                    dropdown={false}
                  />)}
              />
              <Route
                path="/adminItems"
                component={AdminItemsContainer}
              />
              <Route
                path="/generateThumbnails"
                component={() => (
                  <ListItemsContainerOld
                    URL="/util/regenerateAllThumbnails"
                    socketName="regenerateAllThumbnails"
                    dropdown={false}
                  />)}
              />
              <Route
                path="*"
                component={NotFound}
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


/*
        <IndexRoute component={MainChoiceContainer} />


        <IndexRedirect to="/mainChoice" />
        <Route path="/mainChoice" component={MainChoiceContainer} />
*/