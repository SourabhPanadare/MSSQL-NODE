import React, { useState, useEffect, useRef } from "react";
import { Map } from "react-loadable";
import axios from "../axios";
import { Row, Col, Card, CardBody, Label, FormGroup, Button } from "reactstrap";
import { getLoggedInUser } from "../helpers/authUtils";
import Loader from "../components/Loader";
import { AvForm, AvField } from "availity-reactstrap-validation";
import Select from "react-select";

import CreatableSelect from "react-select/creatable";
import { useHistory } from "react-router-dom";
import PageLoader from "../components/PageLoader";
import { Animated } from "react-animated-css";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import moment from "moment";
import Switch from "@material-ui/core/Switch";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import DateFnsUtils from "@date-io/date-fns";
import "../assets/css/Common.css";

function InputQuote() {
  const frmInput = useRef(null);

  const [masters, setMasters] = useState([]);
  const [pageloading, setPageLoading] = useState(true);
  const history = useHistory();
  const [user, setUser] = useState(getLoggedInUser());
  const [selectedDate, setSelectedDate] = useState(null);

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

  useEffect(() => {
    async function fetchMasters() {
      try {
        let objUser = {};
        objUser.id = user.id;
        const response = await axios.get("/Masters");
        setMasters(response.data);
        setCustomers(response.data[0]);
        setProductionLines(response.data[1]);
        setProdLineParameters(response.data[6]);
        generateCustomersArray(response.data[0]);
        generateProdLineArray(response.data[1]);
        generateGaugeArray(response.data[2]);
        generateSheetWidthArray(response.data[3]);
        generateSheetLnArray(response.data[4]);
        generateSkidTypeArray(response.data[5]);

        setPageLoading(false);
        return response;
      } catch (error) {
        console.error();
      }
    }
    fetchMasters();
  }, []);

  const [customers, setCustomers] = useState([]);
  const [productionLines, setProductionLines] = useState([]);
  const [prodLineParameters, setProdLineParameters] = useState([]);
  const [wrap, setWrap] = useState(true);
  const [runCoil, setRunCoil] = useState(true);
  const [formattedCustomerArr, setFormattedCustomerArr] = useState([]);
  const [formattedProdLineArr, setFormattedProdLineArr] = useState([]);
  const [formattedGauges, setFormattedGauges] = useState([]);
  const [formattedSheetWdArr, setFormattedSheetWdArr] = useState([]);
  const [formattedSheetLnArr, setFormattedSheetLnArr] = useState([]);
  const [formattedSkidTypes, setFormattedSkidTypes] = useState([]);
  const [isNewOptionLoading, setIsNewOptionLoading] = useState(false);
  const [isNewWidthLoading, setIsNewWidthLoading] = useState(false);
  const [isNewLengthLoading, setIsNewLengthLoading] = useState(false);
  const [isNewSkidTypeLoading, setIsNewSkidTypeLoading] = useState(false);
  const [selectedGaugeValue, setSelectedGaugeValue] = useState([]);
  const [selectedSheetWdValue, setSelectedSheetWdValue] = useState([]);
  const [selectedSheetLnValue, setSelectedSheetLnValue] = useState([]);
  const [selectedSheetSkidTypeValue, setSelectedSkidTypeValue] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [selectedProdLine, setSelectedProdLine] = useState([]);
  const [showcustomSkidCost, setShowCustomSkidCost] = useState(false);
  const [formData, setFormData] = useState();
  const [formErrors, setFormErrors] = useState([]);
  const [customerError, setCustomerError] = useState(0);
  const [prodLineError, setProdLineError] = useState(0);
  const [gaugeError, setGaugeError] = useState(0);
  const [sheetWidthError, setSheetWidthError] = useState(0);
  const [sheetLengthError, setSheetLengthError] = useState(0);
  const [skidTypeError, setSkidTypeError] = useState(0);
  const createGauge = (label) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
  });
  const isValidNewGauge = (inputValue, selectValue, selectOptions) => {
    if (inputValue > 1 || isNaN(inputValue) || Math.sign(inputValue) === -1) {
      return false;
    }
    return true;
  };
  const isValidOption = (inputValue, selectValue, selectOptions) => {
    if (isNaN(inputValue) || Math.sign(inputValue) === -1 || inputValue < 1) {
      return false;
    }
    return true;
  };
  const createSheetWidth = (label) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
  });

  const createSheetLength = (label) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
  });

  const createSkidType = (label) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
  });

  function handlePaperWap(event) {
    setWrap(event.target.checked);
  }
  function handleRunCoil(event) {
    setRunCoil(event.target.checked);
  }
  const defaultOptions = [
    { value: 1, label: "ABC Fabricators" },
    { value: 2, label: "US Steel" },
    { value: 3, label: "Bent" },
  ];
  const generateCustomersArray = (results) => {
    var fomattedCustomerArray = results.map((person) => ({
      value: person.CustomerID,
      label: person.CustomerName,
    }));
    setFormattedCustomerArr(fomattedCustomerArray);
  };
  const generateProdLineArray = (results) => {
    var formattedProdLineArray = results.map((person) => ({
      value: person.ProductionLineID,
      label: person.Code,
    }));
    setFormattedProdLineArr(formattedProdLineArray);
  };
  const generateGaugeArray = (results) => {
    var formattedGauges = results.map((person) => ({
      value: person.GaugeID,
      label: person.Inches,
    }));
    setFormattedGauges(formattedGauges);
  };
  const generateSheetWidthArray = (results) => {
    var formattedSheetWdArr = results.map((obj) => ({
      value: obj.SheetWidthID,
      label: obj.SheetWidth,
    }));
    setFormattedSheetWdArr(formattedSheetWdArr);
  };
  const generateSheetLnArray = (results) => {
    var formattedSheetLnArr = results.map((obj) => ({
      value: obj.SheetLengthID,
      label: obj.SheetLength,
    }));
    setFormattedSheetLnArr(formattedSheetLnArr);
  };
  const generateSkidTypeArray = (results) => {
    var formattedSkidTypes = results.map((obj) => ({
      value: obj.SkidTypeID,
      label: obj.Description,
    }));
    setFormattedSkidTypes(formattedSkidTypes);
  };
  const handleCreateGauge = (inputValue) => {
    //this.setState({ isLoading: true });
    setIsNewOptionLoading(true);
    //console.group("Option created");
    console.log("Wait a moment...");
    setTimeout(() => {
      const { options } = formattedGauges;
      const newOption = createGauge(inputValue);
      console.log(newOption);
      console.groupEnd();
      setIsNewOptionLoading(false);
      setFormattedGauges(formattedGauges.concat(newOption));
      setSelectedGaugeValue(newOption);
    }, 1000);
  };

  const handleCreateSheetWidth = (inputValue) => {
    //this.setState({ isLoading: true });
    //console.group("Option created");
    setIsNewWidthLoading(true);
    console.log("Wait a moment...");
    setTimeout(() => {
      const { options } = formattedSheetWdArr;
      const newOption = createSheetWidth(inputValue);
      console.log(newOption);
      console.groupEnd();
      setIsNewWidthLoading(false);
      setFormattedSheetWdArr(formattedSheetWdArr.concat(newOption));
      setSelectedSheetWdValue(newOption);
    }, 1000);
  };
  const handleCreateSheetLength = (inputValue) => {
    //this.setState({ isLoading: true });
    //console.group("Option created");
    setIsNewLengthLoading(true);
    console.log("Wait a moment...");
    setTimeout(() => {
      const { options } = formattedSheetLnArr;
      const newOption = createSheetLength(inputValue);
      console.log(newOption);
      console.groupEnd();
      setIsNewLengthLoading(false);
      setFormattedSheetLnArr(formattedSheetLnArr.concat(newOption));
      setSelectedSheetLnValue(newOption);
    }, 1000);
  };
  const handleCreateSkidType = (inputValue) => {
    //this.setState({ isLoading: true });
    //console.group("Option created");
    setIsNewSkidTypeLoading(true);
    console.log("Wait a moment...");
    setTimeout(() => {
      const { options } = formattedSkidTypes;
      const newOption = createSkidType(inputValue);
      console.log(newOption);
      console.groupEnd();
      setIsNewSkidTypeLoading(false);
      setFormattedSkidTypes(formattedSkidTypes.concat(newOption));
      setSelectedSkidTypeValue(newOption);
    }, 1000);
    setShowCustomSkidCost(true);
  };
  const handleChange = (newValue, actionMeta) => {
    console.group("Value Changed");
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
    switch (actionMeta.name) {
      case "drdGauge":
        setSelectedGaugeValue(newValue);
        setGaugeError(0);
        break;
      case "drdSheetWidth":
        setSelectedSheetWdValue(newValue);
        setSheetWidthError(0);
        break;
      case "drdSheetLength":
        setSelectedSheetLnValue(newValue);
        setSheetLengthError(0);
        break;
      case "drdSkidTypes":
        setSelectedSkidTypeValue(newValue);
        setSkidTypeError(0);
        break;
      case "drdCustomers":
        setSelectedCustomer(newValue);
        setCustomerError(0);
        break;
      case "drdProdLines":
        setSelectedProdLine(newValue);
        setProdLineError(0);
        break;
    }
  };
  const resetForm = () => {
    setSelectedGaugeValue([]);
    setSelectedSheetWdValue([]);
    setSelectedSkidTypeValue([]);
    setSelectedSheetLnValue([]);
    setSelectedCustomer([]);
    setSelectedProdLine([]);
    setCustomerError(0);
    setProdLineError(0);
    setGaugeError(0);
    setSheetWidthError(0);
    setSheetLengthError(0);
    setSkidTypeError(0);
    frmInput.current.reset();
  };

  const handleSubmit = (event, errors, values) => {
    console.log(errors);
    console.log(values);
    if (selectedCustomer.length == 0) {
      errors.push("drdCustomers");
      setCustomerError(1);
    } else {
      setCustomerError(0);
    }
    if (selectedProdLine.length == 0) {
      errors.push("drdProdLines");
      setProdLineError(1);
    } else {
      setProdLineError(0);
    }
    if (selectedGaugeValue.length == 0) {
      errors.push("drdGauge");
      setGaugeError(1);
    } else {
      setGaugeError(0);
    }
    if (selectedSheetWdValue.length == 0) {
      errors.push("drdSheetWidth");
      setSheetWidthError(1);
    } else {
      setSheetLengthError(0);
    }
    if (selectedSheetLnValue.length == 0) {
      errors.push("drdSheetLength");
      setSheetLengthError(1);
    } else {
      setSheetLengthError(0);
    }
    if (selectedSheetSkidTypeValue.length == 0) {
      errors.push("drdSkidTypes");
      setSkidTypeError(1);
    } else {
      setSkidTypeError(0);
    }
    var objInput = {};
    objInput.ReqDelDate = values.reqDelDate;
    objInput.Gauge = selectedGaugeValue;
    objInput.SheetWd = selectedSheetWdValue;
    objInput.SheetLn = selectedSheetLnValue;
    objInput.NumberOfSheets = values.txtNumberOfSheets;
    objInput.MaxCustSkidWt = values.txtMaxSkidWt;
    objInput.RepCost = values.txtRepCost;
    objInput.SkidType = selectedSheetSkidTypeValue;
    objInput.ProposedPrice = values.txtProposedPrice;
    objInput.Customer = selectedCustomer;
    objInput.ProdLine = selectedProdLine;
    objInput.RunToFinish = runCoil;
    objInput.Wrap = wrap;
    objInput.masters = masters;
    setFormData(objInput);
    if (errors.length == 0) {
      //Redirect to Compute estimate
      history.push("/Estimate", objInput);
    }
  };

  const changeDate = (selectedDate) => {
    let formattedSelectedDate = moment(selectedDate).format("MM/DD/YYYY");
    setSelectedDate(formattedSelectedDate);
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
      <Animated
        animationIn="fadeIn"
        animationOut="fadeIn"
        animationInDuration={1500}
        isVisible={true}
      >
        <React.Fragment>
          <div className="">
            <Row>
              <Col lg={12}>
                <div className="page-title-box">
                  {/* <div className="page-title-right">
                 <ol className="breadcrumb m-0">
                   <li className="breadcrumb-item">
                     <a href="/">Adminto</a>
                   </li>
                   <li className="breadcrumb-item active">Dashboard</li>
                 </ol>
               </div> */}
                  <h4 className="page-title">New Quote</h4>
                </div>
              </Col>
            </Row>

            <Row>
              <Col lg={12}>
                <Card>
                  <CardBody>
                    <AvForm
                      id="frmInputQuote"
                      onSubmit={handleSubmit}
                      ref={frmInput}
                    >
                      <Row>
                        <Col lg={3} />
                        <Col lg={2}>
                          <label>Customer</label>
                        </Col>
                        <Col lg={2} style={{ marginBottom: 20 }}>
                          {!customerError > 0 ? (
                            <Select
                              id="drdCustomers"
                              name="drdCustomers"
                              required
                              options={formattedCustomerArr}
                              onChange={handleChange}
                              value={selectedCustomer}
                            />
                          ) : (
                            <div>
                              <Select
                                id="drdCustomers"
                                name="drdCustomers"
                                required
                                options={formattedCustomerArr}
                                onChange={handleChange}
                                value={selectedCustomer}
                                className="error"
                              />
                              <span className="error__span">
                                This field is required.
                              </span>
                            </div>
                          )}
                        </Col>
                        <Col lg={3}></Col>
                      </Row>
                      <Row>
                        <Col lg={3} />
                        <Col lg={2}>
                          <label>Requested Delivery Date</label>
                        </Col>
                        <Col lg={2}>
                          <AvField
                            name="reqDelDate"
                            type="date"
                            validate={{
                              required: {
                                value: true,
                                errorMessage: "This field is required.",
                              },
                            }}
                          />
                          {/* <MuiThemeProvider theme={theme}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <KeyboardDatePicker
                                name="reqDelDate"
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
                                onChange={changeDate}
                                autoOk={true}
                                style={{ marginBottom: 20 }}
                              />
                            </MuiPickersUtilsProvider>
                          </MuiThemeProvider> */}
                        </Col>
                        <Col lg={3} />
                      </Row>
                      <Row>
                        <Col lg={3} />
                        <Col lg={2}>
                          <label>Production Line</label>
                        </Col>
                        <Col lg={2} style={{ marginBottom: 20 }}>
                          {prodLineError == 0 ? (
                            <Select
                              id="drdProdLines"
                              name="drdProdLines"
                              options={formattedProdLineArr}
                              value={selectedProdLine}
                              onChange={handleChange}
                            ></Select>
                          ) : (
                            <div>
                              <Select
                                id="drdProdLines"
                                name="drdProdLines"
                                options={formattedProdLineArr}
                                onChange={handleChange}
                                value={selectedProdLine}
                                className="error"
                              ></Select>{" "}
                              <span className="error__span">
                                This field is required.
                              </span>
                            </div>
                          )}
                        </Col>
                        <Col lg={3} />
                      </Row>
                      <Row>
                        <Col lg={3} />
                        <Col lg={2}>
                          <label>Gauge</label>
                        </Col>
                        <Col lg={2} style={{ marginBottom: 20 }}>
                          {gaugeError == 0 ? (
                            <CreatableSelect
                              id="drdGauge"
                              name="drdGauge"
                              required
                              options={formattedGauges}
                              onCreateOption={handleCreateGauge}
                              isClearable
                              onChange={handleChange}
                              isDisabled={isNewOptionLoading}
                              isLoading={isNewOptionLoading}
                              value={selectedGaugeValue}
                              isValidNewOption={isValidNewGauge}
                            />
                          ) : (
                            <div>
                              <CreatableSelect
                                id="drdGauge"
                                name="drdGauge"
                                required
                                options={formattedGauges}
                                onCreateOption={handleCreateGauge}
                                isClearable
                                onChange={handleChange}
                                isDisabled={isNewOptionLoading}
                                isLoading={isNewOptionLoading}
                                value={selectedGaugeValue}
                                isValidNewOption={isValidNewGauge}
                                className="error"
                              />
                              <span className="error__span">
                                This field is required.
                              </span>
                            </div>
                          )}
                        </Col>
                        <Col lg={3}></Col>
                      </Row>
                      <Row>
                        <Col lg={3} />
                        <Col lg={2}>
                          <label>Sheet Width (in.)</label>
                        </Col>
                        <Col lg={2} style={{ marginBottom: 20 }}>
                          {sheetWidthError == 0 ? (
                            <CreatableSelect
                              id="drdSheetWidth"
                              name="drdSheetWidth"
                              required
                              options={formattedSheetWdArr}
                              onCreateOption={handleCreateSheetWidth}
                              isClearable
                              onChange={handleChange}
                              isDisabled={isNewWidthLoading}
                              isLoading={isNewWidthLoading}
                              value={selectedSheetWdValue}
                              isValidNewOption={isValidOption}
                            />
                          ) : (
                            <div>
                              <CreatableSelect
                                id="drdSheetWidth"
                                name="drdSheetWidth"
                                required
                                options={formattedSheetWdArr}
                                onCreateOption={handleCreateSheetWidth}
                                isClearable
                                onChange={handleChange}
                                isDisabled={isNewWidthLoading}
                                isLoading={isNewWidthLoading}
                                value={selectedSheetWdValue}
                                isValidNewOption={isValidOption}
                                className="error"
                              />
                              <span className="error__span">
                                This field is required.
                              </span>
                            </div>
                          )}
                        </Col>
                        <Col lg={3} />
                      </Row>
                      <Row>
                        <Col lg={3} />
                        <Col lg={2}>
                          <label>Sheet Length (in.)</label>
                        </Col>
                        <Col lg={2} style={{ marginBottom: 20 }}>
                          {sheetLengthError == 0 ? (
                            <CreatableSelect
                              id="drdSheetLength"
                              name="drdSheetLength"
                              required
                              options={formattedSheetLnArr}
                              onCreateOption={handleCreateSheetLength}
                              isClearable
                              onChange={handleChange}
                              isDisabled={isNewLengthLoading}
                              isLoading={isNewLengthLoading}
                              value={selectedSheetLnValue}
                              isValidNewOption={isValidOption}
                            />
                          ) : (
                            <div>
                              <CreatableSelect
                                id="drdSheetLength"
                                name="drdSheetLength"
                                required
                                options={formattedSheetLnArr}
                                onCreateOption={handleCreateSheetLength}
                                isClearable
                                onChange={handleChange}
                                isDisabled={isNewLengthLoading}
                                isLoading={isNewLengthLoading}
                                value={selectedSheetLnValue}
                                isValidNewOption={isValidOption}
                                className="error"
                              />
                              <span className="error__span">
                                This field is required.
                              </span>
                            </div>
                          )}
                        </Col>
                        <Col lg={3} />
                      </Row>
                      <Row>
                        <Col lg={3} />
                        <Col lg={2}>
                          <label># Sheets</label>
                        </Col>
                        <Col lg={2}>
                          <AvField
                            name="txtNumberOfSheets"
                            placeholder="# Sheets"
                            type="number"
                            min={1}
                            max={10000}
                            validate={{
                              required: {
                                value: true,
                                errorMessage: "This field is required.",
                              },
                              min: {
                                value: 1,
                                errorMessage:
                                  "Please enter a value between 1 and 10000",
                              },
                              max: {
                                value: 10000,
                                errorMessage:
                                  "Please enter a value between 1 and 10000",
                              },
                            }}
                          />
                        </Col>
                        <Col lg={3} />
                      </Row>
                      <Row>
                        <Col lg={3} />
                        <Col lg={2}>
                          <label>Max Customer Wt per skid (lb.)</label>
                        </Col>
                        <Col lg={2}>
                          <AvField
                            name="txtMaxSkidWt"
                            type="number"
                            min={1}
                            max={10000}
                            validate={{
                              required: {
                                value: true,
                                errorMessage: "This field is required.",
                              },
                              min: {
                                value: 1,
                                errorMessage:
                                  "Please enter a value between 1 and 10000",
                              },
                              max: {
                                value: 10000,
                                errorMessage:
                                  "Please enter a value between 1 and 10000",
                              },
                            }}
                          />
                        </Col>
                        <Col lg={3} />
                      </Row>
                      <Row>
                        <Col lg={3} />
                        <Col lg={2}>
                          <label>Replacement cost - $/cwt.</label>
                        </Col>
                        <Col lg={2}>
                          <AvField
                            name="txtRepCost"
                            type="number"
                            validate={{
                              min: {
                                value: 1,
                                errorMessage:
                                  "Please enter a value between 1 and 10000",
                              },
                              max: {
                                value: 10000,
                                errorMessage:
                                  "Please enter a value between 1 and 10000",
                              },
                            }}
                          />
                        </Col>
                        <Col lg={3} />
                      </Row>
                      <Row>
                        <Col lg={3} />
                        <Col lg={2} style={{ marginBottom: 20 }}>
                          <label>Paper/Plastic Wrap</label>
                        </Col>
                        <Col lg={2}>
                          <MuiThemeProvider theme={theme}>
                            <Switch
                              checked={wrap}
                              name="chkWrap"
                              color="primary"
                              onChange={handlePaperWap}
                            />
                          </MuiThemeProvider>
                        </Col>
                        <Col lg={3} />
                      </Row>
                      <Row>
                        <Col lg={3} />
                        <Col lg={2}>
                          <label>Skid Type</label>
                        </Col>
                        <Col lg={2} style={{ marginBottom: 20 }}>
                          {skidTypeError == 0 ? (
                            <CreatableSelect
                              id="drdSkidTypes"
                              name="drdSkidTypes"
                              required
                              options={formattedSkidTypes}
                              onCreateOption={handleCreateSkidType}
                              isClearable
                              onChange={handleChange}
                              isDisabled={isNewSkidTypeLoading}
                              isLoading={isNewSkidTypeLoading}
                              value={selectedSheetSkidTypeValue}
                            />
                          ) : (
                            <div>
                              <CreatableSelect
                                id="drdSkidTypes"
                                name="drdSkidTypes"
                                required
                                options={formattedSkidTypes}
                                onCreateOption={handleCreateSkidType}
                                isClearable
                                onChange={handleChange}
                                isDisabled={isNewSkidTypeLoading}
                                isLoading={isNewSkidTypeLoading}
                                value={selectedSheetSkidTypeValue}
                                className="error"
                              />
                              <span className="error__span">
                                This field is required.
                              </span>
                            </div>
                          )}
                        </Col>
                        <Col lg={3} />
                      </Row>
                      {showcustomSkidCost && (
                        <Row>
                          <Col lg={3} />
                          <Col lg={2}>
                            <label>Custom Skid Cost</label>
                          </Col>
                          <Col lg={2}>
                            <AvField
                              name="txtCustomSkidCost"
                              type="number"
                              validate={{
                                required: {
                                  value: true,
                                  errorMessage: "This field is required.",
                                },
                              }}
                              min={1}
                              max={10000}
                            />
                          </Col>
                          <Col lg={3} />
                        </Row>
                      )}

                      <Row>
                        <Col lg={3} />
                        <Col lg={2}>
                          <label>Run Remaining Coil to Std Size?</label>
                        </Col>
                        <Col lg={3} style={{ marginBottom: 20 }}>
                          <MuiThemeProvider theme={theme}>
                            <Switch
                              checked={runCoil}
                              name="chkRunCoil"
                              color="primary"
                              onChange={handleRunCoil}
                            />
                          </MuiThemeProvider>
                        </Col>
                        <Col lg={3} />
                      </Row>
                      <Row>
                        <Col lg={3} />
                        <Col lg={2}>
                          <label>Proposed Price $/cwt.</label>
                        </Col>
                        <Col lg={2}>
                          <AvField
                            name="txtProposedPrice"
                            type="number"
                            validate={{
                              required: {
                                value: true,
                                errorMessage: "This field is required.",
                              },
                              min: {
                                value: 1,
                                errorMessage:
                                  "Please enter a value between 1 and 10000",
                              },
                              max: {
                                value: 10000,
                                errorMessage:
                                  "Please enter a value between 1 and 10000",
                              },
                            }}
                            min={1}
                            max={10000}
                          />
                        </Col>
                        <Col lg={3} />
                      </Row>
                      <Row>
                        <Col lg={5} />
                        <Col lg={1} xs={6}>
                          <Button color="primary" className="btn-block">
                            Compute
                          </Button>
                        </Col>
                        <Col lg={1} xs={6}>
                          <Button
                            color="secondary"
                            className="btn-block"
                            onClick={resetForm}
                          >
                            Cancel
                          </Button>
                        </Col>
                      </Row>
                    </AvForm>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </React.Fragment>
      </Animated>
    );
  }
}
export default InputQuote;
