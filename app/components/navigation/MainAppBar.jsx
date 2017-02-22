/* eslint-disable react/prefer-stateless-function */

import React from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';


class MainAppBar extends React.Component {
  constructor() {
    super();
    this.toggle = this.toggle.bind(this);

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

  render() {
    const onMainPage = this.state.route === '/';
    const isOpen = this.state.isOpen || onMainPage;
    const isToggleable = !onMainPage;
    return (
      <Navbar color="" light toggleable={!onMainPage}>
        {isToggleable && <NavbarToggler right onClick={this.toggle} />}
        <NavbarBrand href="/">Food Maniac!</NavbarBrand>
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="/rate">&gt; Rate</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/search">&gt; Search</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/addItem">&gt; Add item</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

export default MainAppBar;
