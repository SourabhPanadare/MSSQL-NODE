import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Collapse } from "reactstrap";
import { getLoggedInUser } from "../helpers/authUtils";

const NavMenuContent = (props) => {
  const onMenuClickCallback = props.onMenuClickCallback;
  const user = getLoggedInUser();
  if (user.role == "Admin") {
    return (
      <React.Fragment>
        <ul className="navigation-menu">
          <li className="has-submenu" onClick={onMenuClickCallback}>
            <Link to="#">
              <i className="mdi mdi-wrench"></i>
              Masters
              {<div className="ml-1 arrow-down"></div>}
            </Link>

            <ul className="submenu">
              <li>
                <Link to="/User/List" className="side-nav-link-ref">
                  Manage Users
                </Link>
              </li>
              <li>
                <Link to="/PLC/List" className="side-nav-link-ref">
                  Manage Production Lines
                </Link>
              </li>
              <li>
                <Link to="/PLParameter/List" className="side-nav-link-ref">
                  Manage Production Line Parameters
                </Link>
              </li>
              <li>
                <Link to="/Customers" className="side-nav-link-ref">
                  Manage Customers
                </Link>
              </li>
              <li>
                <Link to="/ManageGauge/List" className="side-nav-link-ref">
                  Manage Gauge
                </Link>
              </li>
              <li>
                <Link to="/SheetWidth/List" className="side-nav-link-ref">
                  Manage Sheet Width
                </Link>
              </li>
              <li>
                <Link to="/SheetLength/List" className="side-nav-link-ref">
                  Manage Sheet Length
                </Link>
              </li>
              <li>
                <Link to="/SkidType/List" className="side-nav-link-ref">
                  Manage Skid Types
                </Link>
              </li>
              {/* <li className="has-submenu">
                <Link to="/" onClick={onMenuClickCallback}>
                  {" "}
                  <div className="arrow-down"></div> Level 1.2
                </Link>
                <ul className="submenu">
                  <li>
                    <Link to="/" className="side-nav-link-ref">
                      Level 2.1
                    </Link>
                  </li>
                  <li>
                    <Link to="/" className="side-nav-link-ref">
                      Level 2.1
                    </Link>
                  </li>
                </ul>
              </li> */}
            </ul>
          </li>
          <li className="has-submenu">
            <Link to="/Quotations" className="side-nav-link-ref">
              <i className="mdi mdi-clipboard-text"></i>
              Browse Quotations
            </Link>
          </li>
        </ul>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <ul className="navigation-menu">
          <li className="has-submenu">
            <Link to="/Quotations" className="side-nav-link-ref">
              <i className="mdi mdi-clipboard-text"></i>
              My Quotations
            </Link>
          </li>

          <li className="has-submenu">
            <Link to="/InputQuote">
              <i className="mdi mdi-calculator"></i>
              New Quote
              {/* <div className="ml-1 arrow-down"></div> */}
            </Link>
          </li>
        </ul>
      </React.Fragment>
    );
  }
};

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.initMenu = this.initMenu.bind(this);
  }

  /**
   *
   */
  componentDidMount = () => {
    this.initMenu();
  };

  /**
   * Init the menu
   */
  initMenu = () => {
    var links = document.getElementsByClassName("side-nav-link-ref");
    var matchingMenuItem = null;
    for (var i = 0; i < links.length; i++) {
      if (this.props.location.pathname === links[i].pathname) {
        matchingMenuItem = links[i];
        break;
      }
    }

    if (matchingMenuItem) {
      matchingMenuItem.classList.add("active");
      var parent = matchingMenuItem.parentElement;

      /**
       * TODO: This is hard coded way of expading/activating parent menu dropdown and working till level 3.
       * We should come up with non hard coded approach
       */
      if (parent) {
        parent.classList.add("active");
        const parent2 = parent.parentElement;
        if (parent2) {
          parent2.classList.add("in");
        }
        const parent3 = parent2.parentElement;
        if (parent3) {
          parent3.classList.add("active");
          var childAnchor = parent3.querySelector(".has-dropdown");
          if (childAnchor) childAnchor.classList.add("active");
        }

        const parent4 = parent3.parentElement;
        if (parent4) parent4.classList.add("in");
        const parent5 = parent4.parentElement;
        if (parent5) parent5.classList.add("active");
      }
    }
  };

  /**
   * On menu clicked event
   * @param {*} event
   */
  onMenuClick(event) {
    event.preventDefault();
    const nextEl = event.target.nextSibling;
    if (nextEl && !nextEl.classList.contains("open")) {
      const parentEl = event.target.parentNode;
      if (parentEl) {
        parentEl.classList.remove("open");
      }

      nextEl.classList.add("open");
    } else if (nextEl) {
      nextEl.classList.remove("open");
    }
    return false;
  }

  render() {
    return (
      <React.Fragment>
        <div className="topbar-menu">
          <div className="container-fluid">
            <Collapse isOpen={this.props.isMenuOpened} id="navigation">
              <NavMenuContent onMenuClickCallback={this.onMenuClick} />
              <div className="clearfix"></div>
            </Collapse>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(connect()(Navbar));
