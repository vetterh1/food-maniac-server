/* eslint-disable react/forbid-prop-types */

import React, { PropTypes } from 'react';
import { connect, Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
// Import bootstrap directly from cdn in index.html. no need for npm install bootstrap either!
// import 'bootstrap/dist/css/bootstrap.min.css';
import { addLocaleData, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';
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
import Login from '../pages/Login';

const NotFound = () => <h2>404 error - This page is not found!</h2>;



//
// -------------------  i18n  ---------------------
//

addLocaleData([...en, ...fr]);

// Define user's language. Different browsers have the user locale defined
// on different fields on the `navigator` object, so we make sure to account
// for these different by checking all of them
// const language = (navigator.languages && navigator.languages[0]) ||
//                   navigator.language ||
//                   navigator.userLanguage;




class Root extends React.Component {

  constructor() {
    super();
    this.toggle = this.i18nLoad.bind(this);

    this.state = {
      language: 'EN',
      messages: [],
    };
  }


  componentWillMount() {
    this.i18nLoad(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.i18nLoad(nextProps);
  }

  i18nLoad(props) {
    const language = props.languageInfo.codeLanguage;
    const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
    this.setState({
      language,
      messages: localeData[languageWithoutRegionCode] || localeData[language] || localeData.en,
    });
  }


  render() {
    return (
      <Provider store={this.props.store}>
        <IntlProvider locale={this.state.language} messages={this.state.messages}>
          <Router history={browserHistory}>
            <Route path="/" component={App}>
              <IndexRoute component={MainPageContent} />
              <Route path="/rate" component={RateContainer} />
              <Route path="/searchItem" component={SearchItemContainer} />
              <Route path="/login" component={Login} />
              <Route path="/listItems" component={() => (<ListItemsContainer dropdown={false} />)} />
              <Route path="/listItemsOld" component={() => (<ListItemsContainerOld URL="/api/items" dropdown={false} />)} />
              <Route path="/listCategories" component={() => (<ListCategoriesContainer dropdown={false} />)} />
              <Route path="/listKinds" component={() => (<ListKindsContainer dropdown={false} />)} />
              <Route path="/adminItems" component={AdminItemsContainer} />
              <Route path="/generateThumbnails" component={() => (<ListItemsContainerOld URL="/util/regenerateAllThumbnails" socketName="regenerateAllThumbnails" dropdown={false} />)} />
              <Route path="*" component={NotFound} />
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