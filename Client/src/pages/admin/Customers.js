import React, { useState, useEffect } from "react";
import axios from "../../axios";
import DataTable from "react-data-table-component";
import { Redirect, useHistory } from "react-router-dom";
import {
  MDBDataTableV5,
  MDBDropdown,
  MDBDropdownItem,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBBtnGroup,
  MDBBtn,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdbreact";
import {
  Row,
  Col,
  Card,
  CardBody,
  Label,
  FormGroup,
  Button,
  Input,
} from "reactstrap";
import PageLoader from "../../components/PageLoader";
import { Animated } from "react-animated-css";
import "../../assets/css/Customer.css";
import AddIcon from "@material-ui/icons/Add";
function Customers() {
  const [customers, setCustomers] = useState([]);
  const [formattedCustomers, setFormattedCustomers] = useState([]);
  const [pending, setPending] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const history = useHistory();
  const data = {
    columns: [
      {
        label: "Customer",
        field: "CustomerName",
        width: 400,
      },
      {
        label: "Address",
        field: "Address1",
        width: 250,
      },
      {
        label: "City",
        field: "City",
        width: 100,
      },
      {
        label: "State",
        field: "State",
        width: 80,
      },
      {
        label: "Zip",
        field: "Zip",
        width: 50,
      },
      /*  {
        label: "Active",
        field: "IsActive",
        width: 50,
      }, */
    ],
    rows: formattedCustomers,
  };
  useEffect(() => {
    async function fetchCustomers() {
      try {
        let apiURL = `/Customers?cb=${Date.now()}`;
        const response = await axios.get(apiURL);
        const arrCustomers = response.data[0];
        var arrformattedCustomers = arrCustomers.map((element) => ({
          id: element.CustomerID,
          CustomerName: element.CustomerName,
          UserID: element.UserID,
          Address1: element.Address1,
          Address2: element.Address2,
          /* SkidType: quotation.SkidType, */
          City: element.City,
          State: element.State,
          Zip: element.Zip,
          /* IsActive: element.IsActive, */
          //Add more columns here if reqyired
          clickEvent: (e) => handleClick(e, element.CustomerID),
        }));
        setCustomers(response.data[0]);
        setFormattedCustomers(arrformattedCustomers);

        setPending(false);
        setPageLoading(false);
        //setPageLoading(false);
        return response;
      } catch (error) {
        console.error();
      }
    }
    fetchCustomers();
  }, []);

  const handleClick = (e, data, list) => {
    console.log("event target:", e.target, "data:", data);

    history.push(`/Customer/${data}`);

    //history.push("/Customer");
  };
  const divStyle = {
    position: "absolute",
    left: "50%",
    top: "50%",
    zIndex: 9999,
  };
  if (pageLoading) {
    return (
      <div style={divStyle}>
        <Row>
          <Col lg={12}>
            <PageLoader />
          </Col>
        </Row>
      </div>
    );
  } else {
    return (
      <div>
        <React.Fragment>
          <div>
            <Row>
              <Col lg={12}>
                <div className="flex-container">
                  <h4 className="page-title">Manage Customers</h4>
                  <Button
                    lg={3}
                    color="primary"
                    className="quotation__button"
                    onClick={() => history.push("/CreateCustomer")}
                  >
                    <AddIcon /> New
                  </Button>
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <Animated
                  animationIn="fadeIn"
                  animationOut="fadeIn"
                  animationInDuration={1500}
                  isVisible={true}
                >
                  <MDBDataTableV5
                    className="react__table"
                    responsive
                    striped
                    bordered
                    hover
                    data={data}
                    pagingTop={true}
                    searchTop={true}
                    searchBottom={false}
                    barReverse
                    displayEntries={false}
                    fullPagination
                  />
                </Animated>
              </Col>
            </Row>
          </div>
        </React.Fragment>
      </div>
    );
  }
}

export default Customers;
