/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';

// import injectTapEventPlugin from 'react-tap-event-plugin'; // disabled as not compatible with React 16
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/stackslide.css';
import MainAppBar from '../navigation/MainAppBar';
import Footer from '../utils/Footer';
import AlertGeolocalisation from '../utils/AlertGeolocalisation';
import Auth from '../../auth/Auth';
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
import CheckoutContainer from '../checkout/CheckoutContainer';
import CheckoutComplete from '../checkout/CheckoutComplete';
import CheckoutAcqError from '../checkout/CheckoutAcqError';
import CheckoutUnknownError from '../checkout/CheckoutUnknownError';
import CheckoutCancelError from '../checkout/CheckoutCancelError';

const auth = new Auth();

const handleAuthentication = (nextState) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
};


const styles = {
  pageContainer: {
    // background: 'url("images/pasta_alpha30_qty50.jpg") no-repeat center center fixed',
    // backgroundSize: 'cover',
  },
};


const NotFound = () => <h2>404 error - This page is not found!</h2>;


class App extends React.Component {
  static propTypes = {
    // auth: PropTypes.instanceOf(Auth).isRequired,
    // children: PropTypes.node,

  }

  render() {
    return (
      <div style={styles.pageContainer}>
        <MainAppBar auth={auth} location={this.props.location} router={this.props.router} route={this.props.route} />
        <AlertGeolocalisation />
        <Switch>
          <Route
            exact path="/callback"
            component={(props) => {
              handleAuthentication(props);
              return <Callback {...props} />;
            }}
          />
          <Route
            exact path="/rate"
            component={props => <RateContainer auth={auth} {...props} />}
          />
          <Route
            exact path="/search"
            component={props => <SearchItemContainer auth={auth} {...props} />}
          />
          <Route
            exact path="/about"
            component={() => <About />}
          />
          <Route
            exact path="/listItems"
            component={props => <ListItemsContainer dropdown={false} auth={auth} {...props} />}
          />
          <Route
            exact path="/listItemsOld"
            component={props => (
              <ListItemsContainerOld
                URL="/api/items"
                dropdown={false}
                auth={auth}
                {...props}
              />)}
          />
          <Route
            exact path="/listCategories"
            component={props => <ListCategoriesContainer dropdown={false} auth={auth} {...props} />}
          />
          <Route
            exact path="/listKinds"
            component={props => <ListKindsContainer dropdown={false} auth={auth} {...props} />}
          />
          <Route
            exact path="/adminItems"
            component={props => <AdminItemsContainer auth={auth} {...props} />}
          />
          <Route
            exact path="/generateThumbnails"
            component={props => (
              <ListItemsContainerOld
                URL="/util/regenerateAllThumbnails"
                socketName="regenerateAllThumbnails"
                dropdown={false}
                auth={auth}
                {...props}
              />)}
          />
          <Route exact path="/checkout" component={props => <CheckoutContainer />} />
          <Route exact path="/eshop-ok" component={props => <CheckoutComplete auth={auth} {...props} />} />              
          <Route exact path="/eshop-ko-acq" component={props => <CheckoutAcqError auth={auth} {...props} />} />              
          <Route exact path="/eshop-ko-unknown" component={props => <CheckoutUnknownError auth={auth} {...props} />} />              
          <Route exact path="/eshop-ko-cancel" component={props => <CheckoutCancelError auth={auth} {...props} />} />     

          <Route
            exact path="/"
            component={props => <MainPageContent auth={auth} {...props} />}
          />
          <Route
            exact path="*"
            component={NotFound}
            auth={auth}
          />

        </Switch>
        <Footer />
        <Alert stack={{ limit: 3, spacing: 8 }} position="bottom" timeout={5000} effect="stackslide" />
      </div>
    );
  }
}

export default App;
