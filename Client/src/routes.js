import React from "react";
import { Redirect } from "react-router-dom";
import { Route } from "react-router-dom";

import { isUserAuthenticated, getLoggedInUser } from "./helpers/authUtils";
import Estimate from "./pages/Estimate";
import InputQuote from "./pages/InputQuote";
import Quotations from "./pages/Quotations";
import Quotation from "./pages/Quotation";
import Customers from "./pages/admin/Customers";
import Customer from "./pages/admin/Customer";
import CreateCustomer from "./pages/admin/CreateCustomer";
import PLCList from "./pages/admin/PLC/PLCList";
import SkidTypeList from "./pages/admin/SkidType/SkidTypeList";
import SkidType from "./pages/admin/SkidType/SkidType";
import CreateSkidType from "./pages/admin/SkidType/CreateSkidType";
import SheetWidthList from "./pages/admin/SheetWidth/SheetWidthList";
import EditQuotation from "./pages/EditQuotation";
import SheetLengthList from "./pages/admin/SheetLength/SheetLengthList";
import ManageGaugeList from "./pages/admin/ManageGauge/ManageGaugeList";
import UserList from "./pages/admin/User/UserList";
import ErrorPage from "./pages/ErrorPage";
import PLParameterList from "./pages/admin/PLParameter/PLParameterList";
import PLParameter from "./pages/admin/PLParameter/PLParameter";
import CreatePLParameter from "./pages/admin/PLParameter/CreatePLParameter";

// lazy load all the views
const Dashboard = React.lazy(() => import("./pages/Dashboard"));

// auth
const Login = React.lazy(() => import("./pages/auth/Login"));
const Logout = React.lazy(() => import("./pages/auth/Logout"));
const ForgetPassword = React.lazy(() =>
  import("./pages/account/ForgetPassword")
);
const Register = React.lazy(() => import("./pages/account/Register"));
const ConfirmAccount = React.lazy(() => import("./pages/account/Confirm"));
const TestApi = React.lazy(() => import("./TestApi"));

// handle auth and authorization

const PrivateRoute = ({ component: Component, roles, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const isAuthTokenValid = isUserAuthenticated();
      if (!isAuthTokenValid) {
        // not logged in so redirect to login page with the return url
        return (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        );
      }

      const loggedInUser = getLoggedInUser();
      // check if route is restricted by role
      if (roles && roles.indexOf(loggedInUser.role) === -1) {
        // role not authorised so redirect to home page
        return <Redirect to={{ pathname: "/Error" }} />;
      }

      // authorised so return component
      return <Component {...props} />;
    }}
  />
);

const routes = [
  // auth and account

  {
    path: "/Error",
    name: "Error",
    component: ErrorPage,
    route: Route,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    route: Route,
  },
  { path: "/logout", name: "Logout", component: Logout, route: Route },
  {
    path: "/forget-password",
    name: "Forget Password",
    component: ForgetPassword,
    route: Route,
  },
  { path: "/register", name: "Register", component: Register, route: Route },
  { path: "/testapi", name: "TestApi", component: TestApi, route: Route },
  {
    path: "/inputquote",
    name: "InputQuote",
    component: InputQuote,
    route: Route,
  },
  {
    path: "/Quotation/:id",
    name: "Quotation",
    component: Quotation,
    route: Route,
    exact: true,
  },
  {
    path: "/estimate",
    name: "Estimate",
    component: Estimate,
    route: Route,
  },
  {
    path: "/quotations",
    name: "Quotations",
    component: Quotations,
    route: Route,
  },
  {
    path: "/confirm",
    name: "Confirm",
    component: ConfirmAccount,
    route: Route,
  },

  // other pages
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    route: PrivateRoute,
    roles: ["Admin"],
    title: "Dashboard",
  },
  // Admin pages
  {
    path: "/EditQuotation/:id",
    name: "EditQuotation",
    component: EditQuotation,
    exact: true,
    route: PrivateRoute,
    roles: ["Admin"],
    title: "Edit Quotation",
  },
  {
    path: "/Customers",
    name: "Customers",
    component: Customers,
    route: PrivateRoute,
    roles: ["Admin"],
    title: "Customer List",
  },
  {
    path: "/Customer/:id",
    name: "Customer",
    component: Customer,
    route: PrivateRoute,
    roles: ["Admin"],
    title: "Customer",
  },
  {
    path: "/CreateCustomer",
    name: "CreateCustomer",
    component: CreateCustomer,
    route: PrivateRoute,
    roles: ["Admin"],
    title: "Customer",
  },
  {
    path: "/PLC/List",
    name: "ProdLineList",
    component: PLCList,
    route: PrivateRoute,
    roles: ["Admin"],
    title: "Production Line Codes",
  },
  {
    path: "/SkidType/List",
    name: "SkidTypeList",
    component: SkidTypeList,
    route: PrivateRoute,
    roles: ["Admin"],
    title: "Skid Types",
  },
  {
    path: "/SkidTypes/:id",
    name: "SkidType",
    component: SkidType,
    route: PrivateRoute,
    roles: ["Admin"],
    title: "Skid Type",
  },
  {
    path: "/SkidType/Add",
    name: "CreateSkidType",
    component: CreateSkidType,
    route: PrivateRoute,
    roles: ["Admin"],
    title: "Skid Type",
  },
  {
    path: "/SheetWidth/List",
    name: "SheetWidthList",
    component: SheetWidthList,
    route: PrivateRoute,
    roles: ["Admin"],
    title: "Sheet Width",
  },
  {
    path: "/SheetLength/List",
    name: "SheetLengthList",
    component: SheetLengthList,
    route: PrivateRoute,
    roles: ["Admin"],
    title: "Sheet Length",
  },
  {
    path: "/ManageGauge/List",
    name: "ManageGaugeList",
    component: ManageGaugeList,
    route: PrivateRoute,
    roles: ["Admin"],
    title: "Manage Gauge",
  },
  {
    path: "/User/List",
    name: "UserList",
    component: UserList,
    route: PrivateRoute,
    roles: ["Admin"],
    title: "Users",
  },
  {
    path: "/PLParameter/List",
    name: "PLParameterList",
    component: PLParameterList,
    route: PrivateRoute,
    roles: ["Admin"],
    title: "Production Line Parameters",
  },
  {
    path: "/PLParameters/:id",
    name: "PLParameter",
    component: PLParameter,
    route: PrivateRoute,
    roles: ["Admin"],
    title: "Production Line Parameters",
  },
  {
    path: "/PLParameter/Add",
    name: "CreatePLParameter",
    component: CreatePLParameter,
    route: PrivateRoute,
    roles: ["Admin"],
    title: "Production Line Parameters",
  },

  {
    path: "/",
    exact: true,
    component: () => <Redirect to="/InputQuote" />,
    route: PrivateRoute,
  },
];

export { routes, PrivateRoute };
