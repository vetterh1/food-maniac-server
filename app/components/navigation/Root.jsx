/* eslint-disable react/forbid-prop-types */

import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import 'bootstrap/dist/css/bootstrap.css';
import App from '../pages/App';
import MainPageContent from '../pages/MainPageContent';
import RateContainer from '../pages/RateContainer';
import AddItemContainer from '../pages/AddItemContainer';
import SearchItemContainer from '../pages/SearchItemContainer';
import ListItemsContainerOld from '../pages/ListItemsContainerOld';
import ListItemsContainer from '../pages/ListItemsContainer';
import ListCategoriesContainer from '../pages/ListCategoriesContainer';
import ListKindsContainer from '../pages/ListKindsContainer';
import Login from '../pages/Login';

const NotFound = () => <h2>404 error - This page is not found!</h2>;

const Root = ({ store }) => (
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={MainPageContent} />
        <Route path="/rate" component={RateContainer} />
        <Route path="/searchItem" component={SearchItemContainer} />
        <Route path="/addItem" component={AddItemContainer} />
        <Route path="/login" component={Login} />
        <Route path="/listItems" component={() => (<ListItemsContainer dropdown={false} />)} />
        <Route path="/listItemsOld" component={() => (<ListItemsContainerOld URL="/api/items" dropdown={false} />)} />
        <Route path="/listCategories" component={() => (<ListCategoriesContainer dropdown={false} />)} />
        <Route path="/listKinds" component={() => (<ListKindsContainer dropdown={false} />)} />
        <Route path="/generateThumbnails" component={() => (<ListItemsContainerOld URL="/util/regenerateAllThumbnails" socketName="regenerateAllThumbnails" dropdown={false} />)} />
        <Route path="*" component={NotFound} />
      </Route>
    </Router>
  </Provider>
);



Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;


/*
        <IndexRoute component={MainChoiceContainer} />


        <IndexRedirect to="/mainChoice" />
        <Route path="/mainChoice" component={MainChoiceContainer} />
*/