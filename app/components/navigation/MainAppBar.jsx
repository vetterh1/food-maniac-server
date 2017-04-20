/* eslint-disable react/prefer-stateless-function */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';


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
    const isToggleable = !onMainPage;
    return (
      <Navbar color="" light toggleable={!onMainPage}>
        {isToggleable && <NavbarToggler right onClick={this.toggle} />}
        <NavbarBrand tag={Link} to="/" onClick={this.resetOpenState}>Food Maniac!</NavbarBrand>
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink tag={Link} to="/rate" onClick={this.resetOpenState}>&gt; Rate item</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/searchItem" onClick={this.resetOpenState}>&gt; Search item</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/addItem" onClick={this.resetOpenState}>&gt; Add new item</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

export default MainAppBar;
