import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  CardBody,
  Label,
  FormGroup,
  Button,
  Input,
  Spinner,
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
/* import Switch from "react-switch"; */
import axios from "../axios";
import swal from "sweetalert";
import { getLoggedInUser } from "../helpers/authUtils";
import Loader from "../components/Loader";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import { Animated } from "react-animated-css";

function Estimate() {
  const { state } = useLocation();
  const history = useHistory();
  const [gauges, setGauges] = useState([state.masters[2]]);
  const [prodLines, setProdLines] = useState([state.masters[6]]);
  const [skidTypes, setSkidTypes] = useState([state.masters[5]]);
  //const [poundsPerSheet, setPoundsPerSheet] = useState([]);
  const [poundsPerCoil, setPoundsPerCoil] = useState(20000);
  const [user, setUser] = useState(getLoggedInUser());
  const [loading, setLoading] = useState(false);
  const [quoteType, setQuoteType] = useState(false);

  const customTextBox = {
    borderLeft: 0,
    borderRight: 0,
    borderTop: 0,
    borderStyle: "groove",
  };
  const customTextBoxComputation = {
    borderLeft: 0,
    borderRight: 0,
    borderTop: 0,
    borderStyle: "groove",
    width: "100%",
    textAlign: "right",
  };
  const customTextBoxComputationBold = {
    borderLeft: 0,
    borderRight: 0,
    borderTop: 0,
    borderStyle: "groove",
    width: "100%",
    textAlign: "right",
    fontWeight: "bold",
    fontSize: 16,
    color: "#35B8E0",
  };
  const rowStyle = {
    marginTop: 20,
  };
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
    // do stuff here...
    //calculatePoundsPerSheet();
  }, []);
  //Merit Formulae Methods
  const poundsPerSheet = () => {
    //setGauges(state.masters[2]);
    let _poundsPerSheet;
    let objGauge;
    objGauge = gauges[0].filter(
      (person) => person.Inches === state.Gauge.label
    );
    if (state.Gauge.label > 1) {
      _poundsPerSheet =
        state.SheetWd.label *
        state.SheetLn.label *
        (objGauge.length === 0 ? state.Gauge.label : objGauge[0].TrueInches) *
        0.2833;
    } else {
      _poundsPerSheet =
        state.SheetWd.label *
        state.SheetLn.label *
        (objGauge.length === 0
          ? parseFloat(state.Gauge.label)
          : objGauge[0].Inches) *
        0.2833;
    }
    //console.log(Math.round(parseFloat(_poundsPerSheet), 4));
    //setPoundsPerSheet(parseFloat(_poundsPerSheet).toPrecision(6));
    return parseFloat(_poundsPerSheet).toFixed(4);
  };

  const numberOfSkidsNeeded = () => {
    let _poundsPerSheet = poundsPerSheet();
    let _intNumSkids = Math.ceil(
      parseInt(state.NumberOfSheets) /
        (parseInt(state.MaxCustSkidWt) / _poundsPerSheet)
    );
    return _intNumSkids;
  };

  const coilPoundsNeeded = () => {
    let _poundsPerSheet = poundsPerSheet();
    return Math.round(_poundsPerSheet * parseInt(state.NumberOfSheets));
  };

  const numberOfCoilsNeeded = () => {
    let _coilsPoundNeeded = coilPoundsNeeded();
    return Math.ceil(_coilsPoundNeeded / poundsPerCoil);
  };

  const processingCostSheet = () => {
    let _SheetsPerMinute = sheetsPerMinute();
    let objLine = prodLines[0].filter(
      (person) => person.Code.trim() === state.ProdLine.label.trim()
    );
    let _dblProcessingCost =
      objLine[0].CostPerLine / (_SheetsPerMinute * 0.6 * 60);
    //__setProcessingCostPerSheet(parseFloat(_dblProcessingCost).toFixed(4));
    return parseFloat(_dblProcessingCost).toFixed(4);
  };

  const sheetsPerMinute = () => {
    let obJPLP = prodLines[0].filter(
      (person) => person.Code.trim() === state.ProdLine.label.trim()
    );
    let objGauge = gauges[0].filter(
      (person) => person.Inches === state.Gauge.label
    );
    let _dblSheetsPerMinute;
    if (state.Gauge.label > 1) {
      _dblSheetsPerMinute =
        obJPLP[0].Coeffecient +
        obJPLP[0].Thickness *
          (objGauge.length === 0 ? state.Gauge.label : objGauge[0].TrueInches) +
        obJPLP[0].Width * state.SheetWd.label +
        obJPLP[0].Length * state.SheetLn.label;
    } else {
      _dblSheetsPerMinute =
        obJPLP[0].Coeffecient +
        obJPLP[0].Thickness *
          (objGauge.length === 0
            ? parseFloat(state.Gauge.label)
            : objGauge[0].Inches) +
        obJPLP[0].Width * state.SheetWd.label +
        obJPLP[0].Length * state.SheetLn.label;
    }
    return _dblSheetsPerMinute;
  };

  const lineSetupLength = () => {
    let obJPLP = prodLines[0].filter(
      (person) => person.Code.trim() === state.ProdLine.label.trim()
    );
    return 1 * obJPLP[0].SetupLength;
  };

  const lineSetupThickness = () => {
    let obJPLP = prodLines[0].filter(
      (person) => person.Code.trim() === state.ProdLine.label.trim()
    );
    return 1 * obJPLP[0].SetupThickness;
  };

  const runToCompletion = () => {
    let obJPLP = prodLines[0].filter(
      (person) => person.Code.trim() === state.ProdLine.label.trim()
    );

    return state.RunToFinish[0] ? 0 : obJPLP[0].PullCoil;
  };

  const lineCoilSetup = () => {
    let obJPLP = prodLines[0].filter(
      (person) => person.Code.trim() === state.ProdLine.label.trim()
    );

    return 1 * obJPLP[0].CoilSetup;
  };
  const skidChangeoverTime = () => {
    let _numberOfSkids = numberOfSkidsNeeded();
    let obJPLP = prodLines[0].filter(
      (person) => person.Code.trim() === state.ProdLine.label.trim()
    );
    return _numberOfSkids * obJPLP[0].SkidTimeChange;
  };

  const lineSetupCostSheet = () => {
    let obJPLP = prodLines[0].filter(
      (person) => person.Code.trim() === state.ProdLine.label.trim()
    );
    let _dblLineSetupCost, _setUpCost;
    /* let _lineSetupLength,
      _lineSetupThickness,
      _lineCoilSetup,
      _skidChangeoverTime,
      _runToCompletion;
    _lineSetupLength = lineSetupLength();
    _lineSetupThickness = lineSetupThickness();
    _lineCoilSetup = lineCoilSetup();
    _skidChangeoverTime = skidChangeoverTime();
    _runToCompletion = runToCompletion();
    _dblLineSetupCost =
      (obJPLP[0].CostPerLine *
        (_lineSetupLength +
          _lineSetupThickness +
          _lineCoilSetup +
          _skidChangeoverTime +
          _runToCompletion)) /
      60 /
      parseInt(state.NumberOfSheets); */

    _setUpCost = setUpCost();
    return parseFloat(_setUpCost / parseInt(state.NumberOfSheets)).toFixed(4);
  };
  const materialCostPerSheet = () => {
    let _poundsPerSheet = poundsPerSheet();
    return parseInt(state.RepCost) > 0
      ? parseFloat((_poundsPerSheet * parseInt(state.RepCost)) / 100).toFixed(4)
      : 0;
  };

  const SubTotalSheet = () => {
    let _processingCostSheet = processingCostSheet();
    let _lineSetupCostSheet = lineSetupCostSheet();
    let _materialCostPerSheet = materialCostPerSheet();
    return (
      parseFloat(_processingCostSheet) +
      parseFloat(_lineSetupCostSheet) +
      parseFloat(_materialCostPerSheet)
    );
  };

  const totalSkidCost = () => {
    let _totalSkidCost = 0;
    let _SkidCost = 0;
    let _numberOfSkidsNeeded = numberOfSkidsNeeded();
    let objSkidType = skidTypes[0].filter(
      (person) => person.Description.trim() === state.SkidType.label.trim()
    );
    let selectedSheetLn = parseInt(state.SheetLn.label);
    let selectedSheetWd = parseInt(state.SheetWd.label);
    if (selectedSheetLn <= 96) {
      if (selectedSheetWd <= 36) {
        objSkidType = skidTypes[0].filter(
          (person) => person.Width === 36 && person.Length === 96
        );
        _SkidCost = objSkidType[0].SkidCost;
      } else if (selectedSheetWd <= 48) {
        objSkidType = skidTypes[0].filter(
          (person) => person.Width === 48 && person.Length === 96
        );
        _SkidCost = objSkidType[0].SkidCost;
      } else if (selectedSheetWd <= 60) {
        objSkidType = skidTypes[0].filter(
          (person) => person.Width === 60 && person.Length === 96
        );
        _SkidCost = objSkidType[0].SkidCost;
      }
    } else if (selectedSheetLn <= 120) {
      if (selectedSheetWd <= 36) {
        objSkidType = skidTypes[0].filter(
          (person) => person.Width === 36 && person.Length === 120
        );
        _SkidCost = objSkidType[0].SkidCost;
      } else if (selectedSheetWd <= 48) {
        objSkidType = skidTypes[0].filter(
          (person) => person.Width === 48 && person.Length === 120
        );
        _SkidCost = objSkidType[0].SkidCost;
      } else if (selectedSheetWd <= 60) {
        objSkidType = skidTypes[0].filter(
          (person) => person.Width === 60 && person.Length === 120
        );
        _SkidCost = objSkidType[0].SkidCost;
      }
    } else if (selectedSheetLn > 120) {
      _SkidCost = 100;
    }

    _totalSkidCost = _SkidCost * _numberOfSkidsNeeded;
    return _totalSkidCost;
  };

  const skidCostPerSheet = () => {
    let _totalSkidCost = totalSkidCost();
    return parseFloat(_totalSkidCost / parseInt(state.NumberOfSheets)).toFixed(
      4
    );
  };

  const paperWrapCostPerSheet = () => {
    let objSkidType = skidTypes[0].filter(
      (person) => person.Description.trim() === state.SkidType.label.trim()
    );
    let _numberOfSkidsNeeded = numberOfSkidsNeeded();
    if (state.Wrap[0]) {
      return parseFloat(
        objSkidType === null || objSkidType.length === 0
          ? 20
          : (objSkidType[0].WrapCost * _numberOfSkidsNeeded) /
              state.NumberOfSheets
      ).toFixed(4);
    } else {
      return 0;
    }
  };

  const totalCostPerSheet = () => {
    let _SubTotalSheet = SubTotalSheet();
    let _skidCostPerSheet = skidCostPerSheet();
    let _paperWrapCostPerSheet = paperWrapCostPerSheet();
    return parseFloat(
      parseFloat(_SubTotalSheet) +
        parseFloat(_skidCostPerSheet) +
        parseFloat(_paperWrapCostPerSheet)
    ).toFixed(4);
  };

  const processingCostPerCWT = () => {
    let _processingCostSheet = processingCostSheet();
    let _poundsPerSheet = poundsPerSheet();
    return parseFloat((_processingCostSheet / _poundsPerSheet) * 100).toFixed(
      4
    );
  };

  const lineSetupCostPerCWT = () => {
    let _lineSetupCostSheet = lineSetupCostSheet();
    let _poundsPerSheet = poundsPerSheet();
    return parseFloat((_lineSetupCostSheet / _poundsPerSheet) * 100).toFixed(4);
  };

  const materialCostPerCWT = () => {
    let _materialCostPerSheet = materialCostPerSheet();
    let _poundsPerSheet = poundsPerSheet();
    return parseFloat((_materialCostPerSheet / _poundsPerSheet) * 100).toFixed(
      4
    );
  };

  const subTotalPerCWT = () => {
    let _processingCostPerCWT = processingCostPerCWT();
    let _lineSetupCostPerCWT = lineSetupCostPerCWT();
    let _materialCostPerCWT = materialCostPerCWT();
    return parseFloat(
      parseFloat(_processingCostPerCWT) +
        parseFloat(_lineSetupCostPerCWT) +
        parseFloat(_materialCostPerCWT)
    ).toFixed(4);
  };

  const skidCostPerCWT = () => {
    let _skidCostPerSheet = skidCostPerSheet();
    let _poundsPerSheet = poundsPerSheet();
    return parseFloat((_skidCostPerSheet / _poundsPerSheet) * 100).toFixed(4);
  };

  const paperWrapCostPerCWT = () => {
    let _paperWrapCostPerSheet = paperWrapCostPerSheet();
    let _poundsPerSheet = poundsPerSheet();
    if (state.Wrap[0]) {
      return parseFloat(
        (_paperWrapCostPerSheet / _poundsPerSheet) * 100
      ).toFixed(4);
    } else {
      return 0;
    }
  };

  const totalCostPerCWT = () => {
    let _subTotalPerCWT = subTotalPerCWT();
    let _skidCostPerCWT = skidCostPerCWT();
    let _paperWrapCostPerCWT = paperWrapCostPerCWT();
    return parseFloat(
      parseFloat(_subTotalPerCWT) +
        parseFloat(_skidCostPerCWT) +
        parseFloat(_paperWrapCostPerCWT)
    ).toFixed(4);
  };

  const margin = () => {
    let _totalCostPerCWT = totalCostPerCWT();
    return parseFloat(parseInt(state.ProposedPrice) - _totalCostPerCWT).toFixed(
      4
    );
  };

  const percentMargin = () => {
    let _margin = margin();
    return parseFloat(
      (_margin / parseFloat(state.ProposedPrice)) * 100
    ).toFixed(2);
  };

  const totalPounds = () => {
    let _coilPoundsNeeded = coilPoundsNeeded();
    return _coilPoundsNeeded;
  };

  const totalSetupTime = () => {
    let _lineSetupLength = lineSetupLength();
    let _lineSetupThickness = lineSetupThickness();
    let _numberOfCoilsNeeded = numberOfCoilsNeeded();
    let _lineCoilSetup = lineCoilSetup();
    let _skidChangeoverTime = skidChangeoverTime();
    let _runToCompletion = runToCompletion();
    return parseFloat(
      _lineSetupLength +
        _lineSetupThickness +
        (_numberOfCoilsNeeded - 1) * _lineCoilSetup +
        _skidChangeoverTime +
        _runToCompletion
    ).toFixed(4);
  };

  const totalSetupHrs = () => {
    let _totalSetupTime = totalSetupTime();
    return parseFloat(_totalSetupTime / 60).toFixed(2);
  };

  const productionHrs = () => {
    let _sheetsPerMinute = sheetsPerMinute();
    return parseFloat(
      parseInt(state.NumberOfSheets) / _sheetsPerMinute / 60
    ).toFixed(2);
  };

  const totalProductionHrs = () => {
    let _totalSetupHrs = parseFloat(totalSetupHrs());
    let _productionHrs = parseFloat(productionHrs());
    return parseFloat(_totalSetupHrs + _productionHrs).toFixed(2);
  };

  const setUpCost = () => {
    let _totalSetupTime = totalSetupTime();
    let obJPLP = prodLines[0].filter(
      (person) => person.Code.trim() === state.ProdLine.label.trim()
    );
    return parseFloat((_totalSetupTime / 60) * obJPLP[0].CostPerLine).toFixed(
      2
    );
  };

  const dummyUser = {
    FirstName: "Shweta",
    LastName: "Deshmukh",
  };

  const addNewQuotation = async (data) => {
    try {
      const resp = await axios.post("/AddNewQuotation", data);
      console.log(resp);
      setLoading(false);
      swal({
        title: "Done!",
        text: "Quote saved!",
        icon: "success",
        timer: 2000,
        button: false,
      }).then(() => {
        history.push("/Quotations");
      });
    } catch (err) {
      console.log(err);
    }
  };

  const hideAlert = () => {
    console.log("Hiding alert...");
    this.setState({
      alert: null,
    });
  };

  const handleSubmit = (event, errors, values) => {
    //showAlert();
    swal({
      title: "Are you sure?",
      text: "Do you want to save this quotation?",
      icon: "warning",
      dangerMode: false,
      buttons: ["No", "Yes"],
    }).then((willSave) => {
      if (willSave) {
        setLoading(true);
        let objQuote = {};
        objQuote.CustomerID = parseInt(state.Customer.value);
        objQuote.UserID = user.id;
        objQuote.ProductionLineCode = state.ProdLine.label.trim();
        let arrReqDelDate = [];
        arrReqDelDate = state.ReqDelDate.split("/");
        if (arrReqDelDate.length > 0) {
          objQuote.DeliveryDate = new Date(
            arrReqDelDate[2],
            arrReqDelDate[1],
            arrReqDelDate[0]
          );
        } else {
        }
        objQuote.DeliveryDate = new Date();
        objQuote.QuoteDate = new Date(state.ReqDelDate);
        objQuote.QuoteNumber = values.QuoteNo.toString();
        objQuote.Gauge = parseFloat(state.Gauge.label);
        objQuote.SheetWidth = parseFloat(state.SheetWd.label);
        objQuote.SheetLength = parseFloat(state.SheetLn.label);
        objQuote.NumberOfSheets = parseInt(state.NumberOfSheets);
        objQuote.PoundPercCoil = parseFloat(poundsPerCoil);
        objQuote.MaxCustSkid = parseInt(state.MaxCustSkidWt);
        objQuote.ReplacementCost = parseFloat(state.RepCost);
        objQuote.PaperPlasticWrap = state.Wrap;
        objQuote.SkidType = state.SkidType.label;
        objQuote.RunToFinish = state.RunToFinish;
        objQuote.ProcessingCostSheet = parseFloat(
          values.procCostSheet.substring(2)
        );
        objQuote.LineSetupCostSheet = parseFloat(
          values.LineSetupSheet.substring(2)
        );
        objQuote.MaterialCostSheet = parseFloat(
          values.matCostSheet.substring(2)
        );
        objQuote.SubTotalSheet = parseFloat(SubTotalSheet()).toFixed(4);
        objQuote.SkidCostSheet = parseFloat(values.skidCostSheet.substring(2));

        objQuote.PaperWrapCostSheet = state.Wrap[0]
          ? parseFloat(values.wrapcostSheet.substring(2))
          : 0;
        objQuote.TotalCostSheet = parseFloat(values.totCostSheet.substring(2));
        objQuote.ProcessingCostCWT = parseFloat(
          values.procCostCWT.substring(2)
        );
        objQuote.LineSetupCostCWT = parseFloat(
          values.LineSetupCWT.substring(2)
        );
        objQuote.MaterialCostCWT = parseFloat(values.matCostCWT.substring(2));
        objQuote.SubTotalSCWT = parseFloat(subTotalPerCWT());
        objQuote.SkidCostCWT = parseFloat(values.skidCostCWT.substring(2));
        objQuote.PaperWrapCostCWT = state.Wrap[0]
          ? parseFloat(values.wrapCostCWT.substring(2))
          : 0;
        objQuote.TotalCostCWT = parseFloat(values.totCostCWT.substring(2));
        objQuote.ProposedPriceCWT = parseInt(state.ProposedPrice);
        objQuote.Margin = parseFloat(values.margin.substring(2));
        objQuote.PercentMargin = parseFloat(
          values.percentMargin.substring(0, values.percentMargin.length - 2)
        );
        objQuote.TotalPounds = parseInt(totalPounds());
        objQuote.Submitted = "";
        objQuote.Approved = true;
        objQuote.ApprovedDate = new Date();
        objQuote.ApprovedBy = "";
        objQuote.Remarks = "";
        objQuote.ProdHrs = parseFloat(values.totProdHrs).toFixed(2);
        objQuote.Type = quoteType ? "Final" : "Draft";
        addNewQuotation(objQuote);
      }
    });
  };

  const handleSaveAs = (event) => {
    setQuoteType(event.target.checked);
  };

  return (
    <div>
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
                  <h4 className="page-title">
                    Estimate for {state.Customer.label}
                  </h4>
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12}>
                <Card>
                  <CardBody>
                    <AvForm onSubmit={handleSubmit}>
                      <Row style={rowStyle}>
                        <Col lg={3}></Col>
                        <Col lg={2}>
                          <label>Customer</label>
                        </Col>
                        <Col lg={2}>
                          <Input
                            name="selectedCustomer"
                            value={state.Customer.label}
                            disabled
                            style={customTextBox}
                          ></Input>
                        </Col>
                        <Col lg={3}></Col>
                      </Row>
                      <Row style={rowStyle}>
                        <Col lg={3}></Col>
                        <Col lg={2}>
                          <label>Quotation Date</label>
                        </Col>
                        <Col lg={2}>
                          <Input
                            name="QuoteDate"
                            value={state.ReqDelDate}
                            disabled
                            style={customTextBox}
                          ></Input>
                        </Col>
                        <Col lg={3}></Col>
                      </Row>
                      <Row style={rowStyle}>
                        <Col lg={3}></Col>
                        <Col lg={2}>
                          <label>Quotation #</label>
                        </Col>
                        <Col lg={2}>
                          <AvField
                            name="QuoteNo"
                            value={Math.floor(
                              1000000 + Math.random() * 9000000
                            )}
                            disabled
                            style={customTextBox}
                          ></AvField>
                        </Col>
                        <Col lg={3}></Col>
                      </Row>
                      <Row style={rowStyle}>
                        <Col xl={3} lg={3}></Col>
                        <Col xl={2} lg={2}></Col>
                        <Col xl={1} lg={2} style={{ textAlign: "right" }}>
                          <label>
                            <b>Cost (Each)</b>
                          </label>
                        </Col>
                        <Col xl={1} lg={2} style={{ textAlign: "right" }}>
                          <label>
                            <b>Cost/cwt.</b>
                          </label>
                        </Col>
                        <Col xl={3} lg={3}></Col>
                      </Row>
                      <Row style={rowStyle}>
                        <Col xl={3} lg={3}></Col>
                        <Col xl={2} lg={2}>
                          <label>Line Setup</label>
                        </Col>
                        <Col xl={1} lg={2}>
                          <AvField
                            name="LineSetupSheet"
                            value={`$ ${lineSetupCostSheet()}`}
                            disabled
                            style={customTextBoxComputation}
                          ></AvField>
                        </Col>
                        <Col xl={1} lg={2}>
                          <AvField
                            name="LineSetupCWT"
                            value={`$ ${lineSetupCostPerCWT()}`}
                            disabled
                            style={customTextBoxComputation}
                          ></AvField>
                        </Col>
                        <Col xl={3} lg={3}></Col>
                      </Row>
                      <Row style={rowStyle}>
                        <Col xl={3} lg={3}></Col>
                        <Col xl={2} lg={2}>
                          <label>Processing Cost</label>
                        </Col>
                        <Col xl={1} lg={2}>
                          <AvField
                            name="procCostSheet"
                            value={`$ ${processingCostSheet()}`}
                            disabled
                            style={customTextBoxComputation}
                          ></AvField>
                        </Col>
                        <Col xl={1} lg={2}>
                          <AvField
                            name="procCostCWT"
                            value={`$ ${processingCostPerCWT()}`}
                            disabled
                            style={customTextBoxComputation}
                          ></AvField>
                        </Col>
                        <Col xl={3} lg={3}></Col>
                      </Row>
                      <Row style={rowStyle}>
                        <Col xl={3} lg={3}></Col>
                        <Col xl={2} lg={2}>
                          <label>Material Cost</label>
                        </Col>
                        <Col xl={1} lg={2}>
                          <AvField
                            name="matCostSheet"
                            value={`$ ${materialCostPerSheet()}`}
                            disabled
                            style={customTextBoxComputation}
                          ></AvField>
                        </Col>
                        <Col xl={1} lg={2}>
                          <AvField
                            name="matCostCWT"
                            value={`$ ${materialCostPerCWT()}`}
                            disabled
                            style={customTextBoxComputation}
                          ></AvField>
                        </Col>
                        <Col xl={3} lg={3}></Col>
                      </Row>
                      <Row style={rowStyle}>
                        <Col xl={3} lg={3}></Col>
                        <Col xl={2} lg={2}>
                          <label>Skid Cost</label>
                        </Col>
                        <Col xl={1} lg={2}>
                          <AvField
                            name="skidCostSheet"
                            value={`$ ${skidCostPerSheet()}`}
                            disabled
                            style={customTextBoxComputation}
                          ></AvField>
                        </Col>
                        <Col xl={1} lg={2}>
                          <AvField
                            name="skidCostCWT"
                            value={`$ ${skidCostPerCWT()}`}
                            disabled
                            style={customTextBoxComputation}
                          ></AvField>
                        </Col>
                        <Col xl={3} lg={3}></Col>
                      </Row>
                      {state.Wrap[0] ? (
                        <Row style={rowStyle}>
                          <Col xl={3} lg={3}></Col>
                          <Col xl={2} lg={2}>
                            <label>Paper Wrap</label>
                          </Col>
                          <Col xl={3} lg={2}>
                            <AvField
                              name="wrapcostSheet"
                              value={`$ ${paperWrapCostPerSheet()}`}
                              disabled
                              style={customTextBoxComputation}
                            ></AvField>
                          </Col>
                          <Col xl={3} lg={2}>
                            <AvField
                              name="wrapCostCWT"
                              value={`$ ${paperWrapCostPerCWT()}`}
                              disabled
                              style={customTextBoxComputation}
                            ></AvField>
                          </Col>
                          <Col xl={3} lg={3}></Col>
                        </Row>
                      ) : (
                        <Row />
                      )}

                      <Row style={rowStyle}>
                        <Col xl={3} lg={3}></Col>
                        <Col xl={2} lg={2}>
                          <label>Total Cost</label>
                        </Col>
                        <Col xl={1} lg={2}>
                          <AvField
                            name="totCostSheet"
                            value={`$ ${totalCostPerSheet()}`}
                            disabled
                            style={customTextBoxComputationBold}
                          ></AvField>
                        </Col>
                        <Col xl={1} lg={2}>
                          <AvField
                            name="totCostCWT"
                            value={`$ ${totalCostPerCWT()}`}
                            disabled
                            style={customTextBoxComputationBold}
                          ></AvField>
                        </Col>
                        <Col xl={3} lg={3}></Col>
                      </Row>
                      <Row style={rowStyle}>
                        <Col xl={3} lg={3}></Col>
                        <Col xl={2} lg={2}>
                          <label>Proposed price</label>
                        </Col>
                        <Col xl={1} lg={2}></Col>
                        <Col xl={1} lg={2}>
                          <AvField
                            name="propPrice"
                            value={`$ ${parseFloat(state.ProposedPrice).toFixed(
                              2
                            )}`}
                            disabled
                            style={customTextBoxComputation}
                          ></AvField>
                        </Col>
                        <Col xl={3} lg={3}></Col>
                      </Row>
                      <Row style={rowStyle}>
                        <Col xl={3} lg={3}></Col>
                        <Col xl={2} lg={2}>
                          <label>Margin</label>
                        </Col>
                        <Col xl={1} lg={2}></Col>
                        <Col xl={1} lg={2}>
                          <AvField
                            name="margin"
                            value={`$ ${margin()}`}
                            disabled
                            style={customTextBoxComputation}
                          ></AvField>
                        </Col>
                        <Col xl={3} lg={3}></Col>
                      </Row>
                      <Row style={rowStyle}>
                        <Col xl={3} lg={3}></Col>
                        <Col xl={2} lg={2}>
                          <label>Percent Margin</label>
                        </Col>
                        <Col xl={1} lg={2}></Col>
                        <Col xl={1} lg={2}>
                          <AvField
                            name="percentMargin"
                            value={`${percentMargin()} %`}
                            disabled
                            style={customTextBoxComputation}
                          ></AvField>
                        </Col>
                        <Col xl={3} lg={3}></Col>
                      </Row>
                      <Row style={rowStyle}>
                        <Col xl={3} lg={3}></Col>
                        <Col xl={2} lg={2}>
                          <label>Total Pounds</label>
                        </Col>
                        <Col xl={1} lg={2}></Col>
                        <Col xl={1} lg={2}>
                          <AvField
                            name="totPounds"
                            value={totalPounds().toLocaleString()}
                            disabled
                            style={customTextBoxComputation}
                          ></AvField>
                        </Col>
                        <Col xl={3} lg={3}></Col>
                      </Row>
                      <Row style={rowStyle}>
                        <Col xl={3} lg={3}></Col>
                        <Col xl={2} lg={2}>
                          <label>Prod Time (Hrs.)</label>
                        </Col>
                        <Col xl={1} lg={2}></Col>
                        <Col xl={1} lg={2}>
                          <AvField
                            name="totProdHrs"
                            value={totalProductionHrs()}
                            disabled
                            style={customTextBoxComputation}
                          ></AvField>
                        </Col>
                        <Col xl={3} lg={3}></Col>
                      </Row>
                      <Row style={rowStyle}>
                        <Col xl={3} lg={3}></Col>
                        <Col xl={2} lg={2}>
                          <label>Save as?</label>
                        </Col>
                        <Col xl={1} lg={2}></Col>
                        <Col xl={3} lg={3}>
                          {/*  <Switch
                          id="chkSaveAs"
                          checked={true}
                          onColor="#71B6F9"
                        /> */}
                          <Typography component="div">
                            <Grid
                              component="label"
                              container
                              alignItems="center"
                              spacing={1}
                            >
                              <Grid
                                item
                                style={{ fontFamily: "poppins", fontSize: 12 }}
                              >
                                Draft
                              </Grid>
                              <Grid item>
                                <MuiThemeProvider theme={theme}>
                                  <Switch
                                    checked={quoteType}
                                    onChange={handleSaveAs}
                                    name="chkSaveAs"
                                    color="primary"
                                  />
                                </MuiThemeProvider>
                              </Grid>
                              <Grid
                                item
                                style={{ fontFamily: "poppins", fontSize: 12 }}
                              >
                                Final
                              </Grid>
                            </Grid>
                          </Typography>
                        </Col>
                        <Col xl={1} lg={1}></Col>
                      </Row>
                      <Row style={rowStyle}>
                        <Col lg={3}></Col>
                        <Col lg={2}></Col>
                        <Col xl={1} lg={2} xs={6}>
                          <Button
                            color="primary"
                            className="btn-block"
                            onClick={history.goBack}
                          >
                            Back
                          </Button>
                        </Col>
                        {!loading ? (
                          <Col xl={1} lg={2} xs={6}>
                            <Button color="primary" className="btn-block">
                              Save Quote
                            </Button>
                          </Col>
                        ) : (
                          <Col xl={1} lg={2} xs={6}>
                            <Button color="primary" disabled>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />
                              &nbsp; Saving...
                            </Button>
                          </Col>
                        )}

                        <Col xl={3} lg={3}></Col>
                      </Row>
                    </AvForm>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </React.Fragment>
      </Animated>
    </div>
  );
}

export default Estimate;
