/* eslint-disable react/prefer-stateless-function */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import RetreiveLocations from '../utils/RetreiveLocations';
import LanguageBar from '../utils/LanguageBar';


class MainAppBar extends React.Component {
  static propTypes = {
    location: PropTypes.object,
  }

  constructor() {
    super();
    this.toggle = this.toggle.bind(this);
    this.resetOpenState = this.resetOpenState.bind(this);

    this.state = {
      route: window.location.pathname,
      isOpen: false,
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  resetOpenState() {
    this.setState({
      isOpen: false,
    });
  }

  render() {
    const onMainPage = this.props.location.pathname === '/';
    const isOpen = this.state.isOpen || onMainPage;
    return (
      <Navbar color="inverse" inverse toggleable>
        {!onMainPage && <NavbarToggler right onClick={this.toggle} />}
        <NavbarBrand tag={Link} to="/" onClick={this.resetOpenState}>Food Maniac!</NavbarBrand>
        {!onMainPage && <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink className="navbar-link" tag={Link} to="/rate" onClick={this.resetOpenState}>&gt; <FormattedMessage id="item.rate.short" /></NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="navbar-link" tag={Link} to="/searchItem" onClick={this.resetOpenState}>&gt; <FormattedMessage id="item.search.short" /></NavLink>
            </NavItem>
            <NavItem>
              <RetreiveLocations />
            </NavItem>
            <NavItem>
              <LanguageBar />
            </NavItem>
          </Nav>
        </Collapse>}
      </Navbar>
    );
  }
}

export default MainAppBar;
