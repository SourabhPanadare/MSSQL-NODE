import React, { useState, useEffect } from "react";
import axios from "../axios";
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
} from "mdbreact";
import "../assets/css/Quotations.css";
import TextField from "@material-ui/core/TextField";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

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
import PageLoader from "../components/PageLoader";
import DateFnsUtils from "@date-io/date-fns";

import Select from "react-select";
import { getLoggedInUser } from "../helpers/authUtils";
import { Animated } from "react-animated-css";
import moment from "moment";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import AddIcon from "@material-ui/icons/Add";

function Quotations() {
  const [pending, setPending] = React.useState(true);
  const [quotations, setQuotations] = useState([]);
  const [formattedQuotations, setFormattedQuotations] = useState([]);
  const [allFormattedQuotations, setAllFormattedQuotations] = useState([]);
  const [formattedCustomers, setFormattedCustomers] = useState([]);
  const [formattedUsers, setFormattedUsers] = useState([]);
  const [pageloading, setPageLoading] = useState(true);
  const [user, setUser] = useState(getLoggedInUser());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState();
  const [selectedUser, setSelectedUser] = useState();
  const history = useHistory();
  const options = [
    { value: "1", label: "ABC Fabricators" },
    { value: "2", label: "US Steel" },
    { value: "3", label: "Bent Metal Shoppe" },
    { value: "-1", label: "All" },
  ];
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: blue[500],
      },
      secondary: {
        main: "#f44336",
      },
    },
  });
  const columns = [
    {
      name: "Quote #",
      selector: "QuoteNumber",
      sortable: true,
    },
    {
      name: "Quote Date",
      selector: "FormattedQuoteDate",
      sortable: true,
    },
    {
      name: "Customer",
      selector: "Customer",
      sortable: true,
    },

    {
      name: "Production Line",
      selector: "ProductionLineCode",
      sortable: true,
    },
    {
      name: "Skid Type",
      selector: "SkidType",
      sortable: true,
    },
    {
      name: "Line Setup Cost (Sheet)",
      selector: "LineSetupCostSheet",
      sortable: true,
    },
    {
      name: "Line Setup Cost (CWT)",
      selector: "LineSetupCostCWT",
      sortable: true,
    },
    {
      name: "Processing Cost (Sheet)",
      selector: "ProcessingCostSheet",
      sortable: true,
    },
    {
      name: "Processing Cost (CWT)",
      selector: "ProcessingCostCWT",
      sortable: true,
    },
    {
      name: "Total Cost (Sheet)",
      selector: "TotalCostSheet",
      sortable: true,
    },
    {
      name: "Total Cost (CWT)",
      selector: "TotalCostCWT",
      sortable: true,
      right: true,
    },
  ];

  const data = {
    columns: [
      {
        label: "Quote #",
        field: "QuoteNumber",
        width: 100,
      },
      {
        label: "Quote Date",
        field: "FormattedQuoteDate",
        width: 80,
      },
      {
        label: "Customer",
        field: "Customer",
        width: 450,
      },

      {
        label: "Production Line",
        field: "ProductionLineCode",
        width: 50,
      },
      {
        label: "Size (Thickness/Wd/Ln)",
        field: "Size",
        width: 200,
      },
      {
        label: "Total pounds",
        field: "TotalPounds",
        width: 50,
      },
      {
        label: "Line Setup Cost (Sheet)",
        field: "LineSetupCostSheet",
        width: 50,
      },
      {
        label: "Line Setup Cost (CWT)",
        field: "LineSetupCostCWT",
        width: 50,
      },
      {
        label: "Processing Cost (Sheet)",
        field: "ProcessingCostSheet",
        width: 50,
      },
      {
        label: "Processing Cost (CWT)",
        field: "ProcessingCostCWT",
        width: 50,
      },
      {
        label: "Total Cost (Sheet)",
        field: "TotalCostSheet",
        width: 50,
      },
      {
        label: "Total Cost (CWT)",
        field: "TotalCostCWT",
        width: 50,
      },
      {
        label: "Type",
        field: "Type",
        width: 50,
      },
    ],
    rows: formattedQuotations,
  };
  const admindata = {
    columns: [
      {
        label: "Quote #",
        field: "QuoteNumber",
        width: 50,
      },
      {
        label: "Quote Date",
        field: "FormattedQuoteDate",
        width: 50,
      },
      {
        label: "Customer",
        field: "Customer",
        width: 150,
      },
      {
        label: "Sales Rep",
        field: "SalesRep",
        width: 150,
      },
      {
        label: "Production Line",
        field: "ProductionLineCode",
        width: 120,
      },
      {
        label: "Size (Thickness/Wd/Ln)",
        field: "Size",
        width: 170,
      },
      {
        label: "Total pounds",
        field: "TotalPounds",
        width: 70,
      },
      {
        label: "Line Setup Cost (Sheet)",
        field: "LineSetupCostSheet",
        width: 70,
      },
      {
        label: "Line Setup Cost (CWT)",
        field: "LineSetupCostCWT",
        width: 70,
      },
      {
        label: "Processing Cost (Sheet)",
        field: "ProcessingCostSheet",
        width: 70,
      },
      {
        label: "Processing Cost (CWT)",
        field: "ProcessingCostCWT",
        width: 70,
      },
      {
        label: "Total Cost (Sheet)",
        field: "TotalCostSheet",
        width: 70,
      },
      {
        label: "Total Cost (CWT)",
        field: "TotalCostCWT",
        width: 70,
      },
      {
        label: "Type",
        field: "Type",
        width: 80,
      },
    ],
    rows: formattedQuotations,
  };
  useEffect(() => {
    async function fetchQuotations() {
      try {
        let objUser = {};
        objUser.ID = user.id;
        const response = await axios.post("/Quotations", objUser);
        const arrQuotations = response.data[0];
        generateCustomerArray(response.data[1]);
        if (user.role == "Admin") {
          generateUsersArray(response.data[2]);
        }
        var arrformattedQuotations;
        if (user.role == "Admin") {
          arrformattedQuotations = arrQuotations.map((quotation) => ({
            id: quotation.id,
            Customer: quotation.Customer,
            QuoteNumber: quotation.QuoteNumber,
            FormattedQuoteDate: quotation.FormattedQuoteDate,
            ProductionLineCode: quotation.ProductionLineCode,
            /* SkidType: quotation.SkidType, */
            LineSetupCostSheet: quotation.LineSetupCostSheet,
            LineSetupCostCWT: quotation.LineSetupCostCWT,
            ProcessingCostSheet: quotation.ProcessingCostSheet,
            ProcessingCostCWT: quotation.ProcessingCostCWT,
            TotalCostSheet: quotation.TotalCostSheet,
            TotalCostCWT: quotation.TotalCostCWT,
            Size: `${parseFloat(quotation.Gauge)}/${parseFloat(
              quotation.SheetWidth
            ).toFixed(2)}/${parseFloat(quotation.SheetLength).toFixed(2)}`,
            TotalPounds: quotation.TotalPounds.toLocaleString(),
            Type: quotation.Type,
            QuoteDate: quotation.QuoteDate,
            //Add more columns here if reqyired
            SalesRep: `${quotation.FirstName} ${quotation.LastName}`,
            clickEvent: (e) =>
              handleClick(e, quotation.id, arrformattedQuotations),
          }));
        } else {
          arrformattedQuotations = arrQuotations.map((quotation) => ({
            id: quotation.id,
            Customer: quotation.Customer,
            QuoteNumber: quotation.QuoteNumber,
            FormattedQuoteDate: quotation.FormattedQuoteDate,
            ProductionLineCode: quotation.ProductionLineCode,
            /* SkidType: quotation.SkidType, */
            LineSetupCostSheet: quotation.LineSetupCostSheet,
            LineSetupCostCWT: quotation.LineSetupCostCWT,
            ProcessingCostSheet: quotation.ProcessingCostSheet,
            ProcessingCostCWT: quotation.ProcessingCostCWT,
            TotalCostSheet: quotation.TotalCostSheet,
            TotalCostCWT: quotation.TotalCostCWT,
            Size: `${parseFloat(quotation.Gauge)}/${parseFloat(
              quotation.SheetWidth
            ).toFixed(2)}/${parseFloat(quotation.SheetLength).toFixed(2)}`,
            TotalPounds: quotation.TotalPounds.toLocaleString(),
            Type: quotation.Type,
            QuoteDate: quotation.QuoteDate,
            //Add more columns here if reqyired

            clickEvent: (e) =>
              handleClick(e, quotation.id, arrformattedQuotations),
          }));
        }

        setQuotations(response.data[0]);
        setFormattedQuotations(arrformattedQuotations);
        setAllFormattedQuotations(arrformattedQuotations);

        setPending(false);
        setPageLoading(false);
        //setPageLoading(false);
        return response;
      } catch (error) {
        console.error();
      }
    }
    fetchQuotations();
  }, []);

  const handleClick = (e, data, list) => {
    console.log("event target:", e.target, "data:", data);
    let objNavigation = {};
    let arrQuotes = [];

    list.forEach((element) => {
      arrQuotes.push(element.id);
    });

    /* objNavigation.FirstQuote = list[0].id;
    objNavigation.LastQuote = list[list.length - 1].id;
    objNavigation.Records = list.length; */
    //return <Redirect to={`/Quotation/ ${data}`}></Redirect>;
    if (user.role == "Admin") {
      history.push(`/EditQuotation/${data}`, arrQuotes);
    } else {
      history.push(`/Quotation/${data}`, arrQuotes);
    }
  };
  const generateCustomerArray = (results) => {
    let arrformattedCustomers = results.map((element) => ({
      value: element.CustomerID,
      label: element.CustomerName,
    }));
    var allOption = {
      value: "-1",
      label: "All",
    };
    arrformattedCustomers = [...arrformattedCustomers, allOption];
    setFormattedCustomers(arrformattedCustomers);
  };
  const generateUsersArray = (results) => {
    let arrFormattedUsers = results.map((element) => ({
      value: element.UserID,
      label: `${element.FirstName} ${element.LastName}`,
    }));
    var allOption = {
      value: "-1",
      label: "All",
    };
    arrFormattedUsers = [...arrFormattedUsers, allOption];
    setFormattedUsers(arrFormattedUsers);
  };
  const filterByCustomer = (newValue, actionMeta) => {
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.log(formattedQuotations);
    let filteredByCustomer;
    if (newValue.value != -1) {
      filteredByCustomer = allFormattedQuotations.filter(
        selectedDate && selectedUser
          ? (person) =>
              person.Customer === newValue.label &&
              person.SalesRep == selectedUser.label &&
              person.FormattedQuoteDate ===
                moment(selectedDate).format("MM/DD/YYYY")
          : selectedDate
          ? (person) =>
              person.Customer === newValue.label &&
              person.FormattedQuoteDate ===
                moment(selectedDate).format("MM/DD/YYYY")
          : selectedUser
          ? (person) =>
              person.Customer === newValue.label &&
              person.SalesRep == selectedUser.label
          : (person) => person.Customer === newValue.label
      );
      let new_array = filteredByCustomer.map((element) =>
        element.Customer == newValue.label
          ? {
              ...element,
              clickEvent: (e) => handleClick(e, element.id, new_array),
            }
          : element
      );
      console.log(filteredByCustomer);
      setSelectedCustomer(newValue);
      setFormattedQuotations(new_array);
    } else {
      setFormattedQuotations(allFormattedQuotations);
    }
  };
  const filterByDate = (selectedDate) => {
    console.log(selectedDate);
    console.log(moment(selectedDate).format("MM/DD/YYYY"));
    let filteredByDate;
    let formattedSelectedDate = moment(selectedDate).format("MM/DD/YYYY");
    if (selectedDate != "") {
      filteredByDate = allFormattedQuotations.filter(
        selectedUser && selectedCustomer
          ? (person) =>
              person.FormattedQuoteDate === formattedSelectedDate &&
              person.SalesRep == selectedUser.label &&
              person.Customer == selectedCustomer.label
          : selectedCustomer
          ? (person) =>
              person.FormattedQuoteDate === formattedSelectedDate &&
              person.Customer == selectedCustomer.label
          : selectedUser
          ? (person) =>
              person.FormattedQuoteDate === formattedSelectedDate &&
              person.SalesRep == selectedUser.label
          : (person) => person.FormattedQuoteDate === formattedSelectedDate
      );

      let new_array = filteredByDate.map((element) =>
        element.FormattedQuoteDate == formattedSelectedDate
          ? {
              ...element,
              clickEvent: (e) => handleClick(e, element.id, new_array),
            }
          : element
      );
      console.log(filteredByDate);
      setFormattedQuotations(new_array);
    } else {
      setFormattedQuotations(allFormattedQuotations);
    }
    setSelectedDate(selectedDate);
  };
  const filterByUser = (newValue, actionMeta) => {
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.log(formattedQuotations);
    let filteredByUser;
    if (newValue.value != -1) {
      filteredByUser = allFormattedQuotations.filter(
        selectedDate && selectedCustomer
          ? (person) =>
              person.SalesRep === newValue.label &&
              person.Customer == selectedCustomer.label &&
              person.FormattedQuoteDate ===
                moment(selectedDate).format("MM/DD/YYYY")
          : selectedDate
          ? (person) =>
              person.SalesRep === newValue.label &&
              person.FormattedQuoteDate ===
                moment(selectedDate).format("MM/DD/YYYY")
          : selectedCustomer
          ? (person) =>
              person.SalesRep === newValue.label &&
              person.Customer == selectedCustomer.label
          : (person) => person.SalesRep === newValue.label
      );
      let new_array = filteredByUser.map((element) =>
        element.SalesRep == newValue.label
          ? {
              ...element,
              clickEvent: (e) => handleClick(e, element.id, new_array),
            }
          : element
      );
      console.log(filteredByUser);
      setSelectedUser(newValue);
      setFormattedQuotations(new_array);
    } else {
      setFormattedQuotations(allFormattedQuotations);
    }
  };
  const clearFilters = () => {
    setSelectedDate(null);
    setSelectedCustomer(null);
    setSelectedUser(null);
    setFormattedQuotations(allFormattedQuotations);
  };
  const customTable = {
    fontSize: 18,
    color: "#6c757d",
    fontFamily: "'Roboto', sans-serif",
  };
  const customStyles = {
    header: {
      style: {
        fontSize: "22px",
        minHeight: "56px",
        paddingLeft: "16px",
        paddingRight: "8px",
        textAlign: "left",
      },
    },
    headRow: {
      style: {
        fontSize: "22px",
      },
    },
    headCells: {
      style: {
        fontSize: "14.4px",
        fontWeight: "bold",
        color: "#6c757d",
        fontFamily: "'Roboto', sans-serif",
      },
    },
    cells: {
      style: {
        fontSize: "14.4px",
        color: "#6c757d",
        fontFamily: "'Roboto', sans-serif",
      },
    },
  };
  const divStyle = {
    position: "absolute",
    left: "50%",
    top: "50%",
    zIndex: 9999,
  };
  if (pageloading) {
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
                <div className="page-title-box">
                  {user.role == "Admin" ? (
                    <h4 className="page-title">Quotations</h4>
                  ) : (
                    <h4 className="page-title">My Quotations</h4>
                  )}
                </div>
              </Col>
            </Row>
            <Row style={{ display: "block" }}>
              <Col lg={12} xs={12}>
                <div className="customfilterContainer">
                  <label className="customFilerLabel">
                    Filter by Customer:
                  </label>
                  <Select
                    className="drdCustomer"
                    options={formattedCustomers}
                    onChange={filterByCustomer}
                    value={selectedCustomer}
                  ></Select>
                  {user.role == "Admin" ? (
                    <label className="customFilerLabel">
                      Filter by Sales Rep:
                    </label>
                  ) : (
                    <span />
                  )}
                  {user.role == "Admin" ? (
                    <Select
                      className="drdSalesRep"
                      options={formattedUsers}
                      onChange={filterByUser}
                      value={selectedUser}
                    ></Select>
                  ) : (
                    <span />
                  )}

                  <label className="customFilerLabel">Filter by date:</label>
                  {/* <TextField
                    name="reqDelDate"
                    type="date"
                    onChange={filterByDate}
                    format="MM/DD/YYYY"
                  /> */}
                  <MuiThemeProvider theme={theme}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        color="primary"
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label=""
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        value={selectedDate}
                        onChange={filterByDate}
                        autoOk={true}
                      />
                    </MuiPickersUtilsProvider>
                  </MuiThemeProvider>

                  <Button
                    color="primary"
                    className="customResetFilters"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                  {user.role == "Admin" ? (
                    <div className="customfilterContainer__add">
                      <Button
                        lg={3}
                        color="primary"
                        onClick={() => history.push("/InputQuote")}
                      >
                        <AddIcon /> New
                      </Button>
                    </div>
                  ) : (
                    <div />
                  )}
                </div>
              </Col>
            </Row>
            <Row className="rowTopMargin">
              <Col lg={12}>
                {/* <DataTable
                customStyles={customStyles}
                columns={columns}
                data={quotations}
                pagination={true}
                striped={true}
                pointerOnHover={true}
                highlightOnHover={true}
                responsive={true}
                subHeader={true}
                progressComponent={<PageLoader></PageLoader>}
                progressPending={pending}
                theme="default"
                subHeaderComponent={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <TextField
                      id="outlined-basic"
                      label="Search"
                      variant="outlined"
                      size="small"
                      style={{ margin: "5px" }}
                    />
                  </div>
                }
                onRowClicked={(e) => {
                  alert(`Row Clicked ${e.id}`);
                }}
              ></DataTable> */}
                <Animated
                  animationIn="fadeIn"
                  animationOut="fadeIn"
                  animationInDuration={1500}
                  isVisible={true}
                >
                  {user.role == "Admin" ? (
                    <MDBDataTableV5
                      className="react__table"
                      responsive
                      striped
                      bordered
                      hover
                      data={admindata}
                      pagingTop={true}
                      searchTop={true}
                      searchBottom={false}
                      barReverse
                      displayEntries={false}
                      fullPagination
                      scrollX={false}
                    />
                  ) : (
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
                  )}
                </Animated>
              </Col>
            </Row>
            <Row />
          </div>
        </React.Fragment>
      </div>
    );
  }
}

export default Quotations;
