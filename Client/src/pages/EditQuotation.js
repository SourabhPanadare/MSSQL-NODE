import React, { useState, useEffect, useRef } from "react";
import { Divider } from "@material-ui/core";
import { Row, Col, Card, CardBody, Button, Input, Spinner } from "reactstrap";
import "../assets/css/EditQuotation.css";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { useHistory, useLocation } from "react-router-dom";
import axios from "../axios";
import PageLoader from "../components/PageLoader";
import { Animated } from "react-animated-css";
import Select from "react-select";
import Switch from "@material-ui/core/Switch";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import CreatableSelect from "react-select/creatable";
import { AvForm, AvField } from "availity-reactstrap-validation";
import AvInput from "availity-reactstrap-validation/lib/AvInput";
import swal from "sweetalert";
import { getLoggedInUser } from "../helpers/authUtils";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import "../assets/css/Common.css";

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
const customTextBox = {
  borderLeft: 0,
  borderRight: 0,
  borderTop: 0,
  borderStyle: "groove",
};
const customTextBoxComputationBold = {
  borderLeft: 0,
  borderRight: 0,
  borderTop: 0,
  borderStyle: "groove",
  width: "100%",
  textAlign: "right",
  fontWeight: "bold",
  fontSize: 12,
  color: "#35B8E0",
};
const divStyle = {
  position: "absolute",
  left: "50%",
  top: "50%",
  zIndex: 9999,
};

function EditQuotation(props) {
  const history = useHistory();
  const frmInput = useRef(null);
  const { filteredQuoteIDs } = useLocation();
  const [quotation, setQuotation] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [currentQuotation, setCurrentQuotation] = useState(null);
  const [totalQuotations, setTotalQuotations] = useState(0);
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(
    history.location.state.findIndex(
      (id) => id == parseInt(props.match.params.id)
    )
  );

  const [formattedproductionLines, setFormattedProductionLines] = useState([]);
  const [formattedCustomers, setFormattedCustomers] = useState([]);
  const [formattedGauges, setFormattedGauges] = useState([]);
  const [formattedSheetWdArr, setFormattedSheetWdArr] = useState([]);
  const [formattedSheetLnArr, setFormattedSheetLnArr] = useState([]);
  const [formattedSkidTypes, setFormattedSkidTypes] = useState([]);
  const [prodLineParameters, setProdLineParameters] = useState([]);
  const [selectedGaugeValue, setSelectedGaugeValue] = useState([]);
  const [selectedSheetWdValue, setSelectedSheetWdValue] = useState([]);
  const [selectedSheetLnValue, setSelectedSheetLnValue] = useState([]);
  const [selectedSheetSkidTypeValue, setSelectedSkidTypeValue] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [selectedProdLine, setSelectedProdLine] = useState([]);
  const [isNewOptionLoading, setIsNewOptionLoading] = useState(false);
  const [isNewWidthLoading, setIsNewWidthLoading] = useState(false);
  const [isNewLengthLoading, setIsNewLengthLoading] = useState(false);
  const [isNewSkidTypeLoading, setIsNewSkidTypeLoading] = useState(false);
  const [runToFinish, setRunToFinish] = useState(true);
  const [wrap, setWrap] = useState(true);
  const [userValues, setUserValues] = useState({
    txtNumberOfSheets: "",
    txtMaxSkidWt: "",
    txtRepCost: "",
    txtProposedPrice: "",
    chkType: false,
  });
  const [poundsPerCoil, setPoundsPerCoil] = useState(20000);
  const [gauges, setGauges] = useState([]);
  const [prodLines, setProdLines] = useState([]);
  const [skidTypes, setSkidTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(getLoggedInUser());
  const [deleting, setDeleting] = useState(false);
  const [gaugeError, setGaugeError] = useState(0);
  const [sheetWidthError, setSheetWidthError] = useState(0);
  const [sheetLengthError, setSheetLengthError] = useState(0);
  const [skidTypeError, setSkidTypeError] = useState(0);
  //setCurrentQuotation(parseInt(props.match.params.id));
  //setFilteredQuotations(filteredQuoteIDs);
  useEffect(() => {
    async function fetchQuotation() {
      try {
        let apiURL = `/Quotation/${props.match.params.id
          .toString()
          .trim()}?cb=${Date.now()}`;
        console.log(apiURL);
        const response = await axios.get(apiURL);

        const masters = await axios.get("/Masters");
        setQuotation(response.data[0][0]);
        setCurrentQuotation(parseInt(props.match.params.id));
        setTotalQuotations(history.location.state.length);
        setGauges(masters.data[2]);
        setProdLines(masters.data[6]);
        setSkidTypes(masters.data[5]);
        generateCustomerArray(masters.data[0], response.data[0][0]);
        generateProdLineArray(masters.data[1], response.data[0][0]);
        setProdLineParameters(masters.data[6]);
        generateGaugeArray(masters.data[2], response.data[0][0]);
        generateSheetWidthArray(masters.data[3], response.data[0][0]);
        generateSheetLnArray(masters.data[4], response.data[0][0]);
        generateSkidTypeArray(masters.data[5], response.data[0][0]);
        setRunToFinish(response.data[0][0].RunToFinish);
        setWrap(response.data[0][0].PaperPlasticWrap);
        setUserValues({
          ...userValues,
          txtNumberOfSheets: response.data[0][0].NumberOfSheet,
          txtMaxSkidWt: response.data[0][0].MaxCustSkid,
          txtRepCost: response.data[0][0].ReplacementCost,
          txtProposedPrice: response.data[0][0].ProposedPriceCWT,
          chkType: response.data[0][0].Type == "Draft" ? false : true,
        });
        setPageLoading(false);

        return response;
      } catch (error) {
        console.error();
      }
    }
    fetchQuotation();
  }, []);

  const generateCustomerArray = (results, quotation) => {
    let arrformattedCustomers = results.map((person) => ({
      value: person.CustomerID,
      label: person.CustomerName,
    }));
    setFormattedCustomers(arrformattedCustomers);

    let objSelectedUser = arrformattedCustomers.filter(
      (element) => element.value === quotation.CustomerID
    );
    setSelectedCustomer(objSelectedUser[0]);
  };

  const generateProdLineArray = (results, quotation) => {
    let arrFormattedProdLines = results.map((element) => ({
      value: element.ProductionLineID,
      label: element.Code,
    }));
    setFormattedProductionLines(arrFormattedProdLines);

    let objSelected = arrFormattedProdLines.filter(
      (element) => element.label === quotation.ProductionLineCode
    );
    setSelectedProdLine(objSelected[0]);
  };

  const generateGaugeArray = (results, quotation) => {
    var formattedGauges = results.map((person) => ({
      value: person.GaugeID,
      label: person.Inches,
    }));
    setFormattedGauges(formattedGauges);

    let objSelected = formattedGauges.filter(
      (element) => element.label === quotation.Gauge
    );
    setSelectedGaugeValue(objSelected[0]);
  };
  const generateSheetWidthArray = (results, quotation) => {
    var formattedSheetWdArr = results.map((obj) => ({
      value: obj.SheetWidthID,
      label: obj.SheetWidth,
    }));
    setFormattedSheetWdArr(formattedSheetWdArr);

    let objSelected = formattedSheetWdArr.filter(
      (element) => element.label === quotation.SheetWidth
    );
    setSelectedSheetWdValue(objSelected[0]);
  };
  const generateSheetLnArray = (results, quotation) => {
    var formattedSheetLnArr = results.map((obj) => ({
      value: obj.SheetLengthID,
      label: obj.SheetLength,
    }));
    setFormattedSheetLnArr(formattedSheetLnArr);

    let objSelected = formattedSheetLnArr.filter(
      (element) => element.label === quotation.SheetLength
    );
    setSelectedSheetLnValue(objSelected[0]);
  };
  const generateSkidTypeArray = (results, quotation) => {
    var formattedSkidTypes = results.map((obj) => ({
      value: obj.SkidTypeID,
      label: obj.Description,
    }));
    setFormattedSkidTypes(formattedSkidTypes);

    let objSelected = formattedSkidTypes.filter(
      (element) => element.label === quotation.SkidType
    );
    setSelectedSkidTypeValue(objSelected[0]);
  };
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

  const goToPrevQuotation = () => {
    //currentQuotation = currentQuotation - 1;
    let arrQuotes = history.location.state;
    let navigateTo, index;
    if (arrQuotes.length > 0) {
      index = arrQuotes.findIndex(
        (id) => id == parseInt(props.match.params.id)
      );
      index > 0
        ? (navigateTo = arrQuotes[index - 1])
        : (navigateTo = arrQuotes[index]);
    }
    setCurrentIndex(index - 1);
    //history.push(`/Quotation/${parseInt(props.match.params.id) - 1}`);
    history.push(`/Quotation/${parseInt(navigateTo)}`, arrQuotes);
    //history.go(0);
    window.location.reload();
  };
  const goToNextQuotation = () => {
    let arrQuotes = history.location.state;
    let navigateTo, index;
    if (arrQuotes.length > 0) {
      index = arrQuotes.findIndex(
        (id) => id == parseInt(props.match.params.id)
      );
      index < arrQuotes.length
        ? (navigateTo = arrQuotes[index + 1])
        : (navigateTo = arrQuotes[index]);
    }
    setCurrentIndex(index + 1);
    history.push(`/Quotation/${parseInt(navigateTo)}`, arrQuotes);
    //currentQuotation = currentQuotation - 1;
    //history.push(`/Quotation/${parseInt(props.match.params.id) + 1}`);
    window.location.reload();
  };

  const handleChange = (newValue, actionMeta) => {
    console.group("Value Changed");
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
    switch (actionMeta.name) {
      case "drdGauge":
        setSelectedGaugeValue(newValue);
        if (newValue == null) {
          setGaugeError(1);
        } else {
          setGaugeError(0);
        }
        break;
      case "drdSheetWidth":
        setSelectedSheetWdValue(newValue);
        if (newValue == null) {
          setSheetWidthError(1);
        } else {
          setSheetWidthError(0);
        }
        break;
      case "drdSheetLength":
        setSelectedSheetLnValue(newValue);
        if (newValue == null) {
          setSheetLengthError(1);
        } else {
          setSheetLengthError(0);
        }

        break;
      case "drdSkidTypes":
        setSelectedSkidTypeValue(newValue);
        if (newValue == null) {
          setSkidTypeError(1);
        } else {
          setSkidTypeError(0);
        }

        break;
      case "drdCustomers":
        setSelectedCustomer(newValue);
        break;
      case "drdProdLines":
        setSelectedProdLine(newValue);
        break;
    }
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
    //setShowCustomSkidCost(true);
  };

  const handleSubmit = (event, errors, values) => {
    if (selectedGaugeValue == null) {
      errors.push("drdGauge");
      setGaugeError(1);
    } else {
      setGaugeError(0);
    }
    if (selectedSheetWdValue == null) {
      errors.push("drdSheetWidth");
      setSheetWidthError(1);
    } else {
      setSheetLengthError(0);
    }
    if (selectedSheetLnValue == null) {
      errors.push("drdSheetLength");
      setSheetLengthError(1);
    } else {
      setSheetLengthError(0);
    }
    if (selectedSheetSkidTypeValue == null) {
      errors.push("drdSkidTypes");
      setSkidTypeError(1);
    } else {
      setSkidTypeError(0);
    }
    if (errors.length == 0) {
      swal({
        title: "Are you sure?",
        text: "Do you want to update this quotation?",
        icon: "warning",
        dangerMode: false,
        buttons: ["No", "Yes"],
      }).then((willSave) => {
        if (willSave) {
          setLoading(true);

          let objQuote = {};
          objQuote.ID = quotation.id;
          objQuote.CustomerID = parseInt(selectedCustomer.value);
          objQuote.UserID = quotation.UserID;
          objQuote.ProductionLineCode = selectedProdLine.label.trim();
          objQuote.DeliveryDate = quotation.QuoteDate;
          objQuote.QuoteDate = quotation.QuoteDate;
          objQuote.Gauge = parseFloat(selectedGaugeValue.label);
          objQuote.SheetWidth = parseFloat(selectedSheetWdValue.label);
          objQuote.SheetLength = parseFloat(selectedSheetLnValue.label);
          objQuote.NumberOfSheets = parseInt(values.txtNumberOfSheets);
          objQuote.PoundPercCoil = parseFloat(poundsPerCoil);
          objQuote.MaxCustSkid = parseInt(values.txtMaxSkidWt);
          objQuote.ReplacementCost = parseFloat(values.txtRepCost);
          objQuote.PaperPlasticWrap = wrap;
          objQuote.SkidType = selectedSheetSkidTypeValue.label;
          objQuote.RunToFinish = runToFinish;
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
          objQuote.SkidCostSheet = parseFloat(
            values.skidCostSheet.substring(2)
          );

          objQuote.PaperWrapCostSheet = wrap
            ? parseFloat(values.wrapcostSheet.substring(2))
            : 0;
          objQuote.TotalCostSheet = parseFloat(
            values.totCostSheet.substring(2)
          );
          objQuote.ProcessingCostCWT = parseFloat(
            values.procCostCWT.substring(2)
          );
          objQuote.LineSetupCostCWT = parseFloat(
            values.LineSetupCWT.substring(2)
          );
          objQuote.MaterialCostCWT = parseFloat(values.matCostCWT.substring(2));
          objQuote.SubTotalSCWT = parseFloat(subTotalPerCWT());
          objQuote.SkidCostCWT = parseFloat(values.skidCostCWT.substring(2));
          objQuote.PaperWrapCostCWT = wrap
            ? parseFloat(values.wrapCostCWT.substring(2))
            : 0;
          objQuote.TotalCostCWT = parseFloat(values.totCostCWT.substring(2));
          objQuote.ProposedPriceCWT = parseInt(values.txtProposedPrice);
          objQuote.Margin = parseFloat(values.margin.substring(2));
          objQuote.PercentMargin = parseFloat(
            values.percentMargin.substring(0, values.percentMargin.length - 2)
          );
          objQuote.TotalPounds = parseInt(totalPounds());

          objQuote.ProdHrs = parseFloat(values.totProdHrs).toFixed(2);
          objQuote.Type = userValues.chkType ? "Final" : "Draft";
          objQuote.EditedBy = currentUser.id;
          updateQuotation(objQuote);
        }
      });
    }
    console.log(event);
  };
  const updateQuotation = async (data) => {
    try {
      const resp = await axios.put("/Quotation", data);
      console.log(resp);
      setLoading(false);
      swal({
        title: "Done!",
        text: "Quote updated!",
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
  const handleRunToFinish = (event) => {
    setRunToFinish(event.target.checked);
  };
  const handleWrap = (event) => {
    setWrap(event.target.checked);
  };
  const handleType = () => {};
  const poundsPerSheet = () => {
    //setGauges(state.masters[2]);
    let _poundsPerSheet;
    let objGauge;
    let selectedGauge =
      selectedGaugeValue == null ? quotation.Gauge : selectedGaugeValue.label;
    let selectedSheetWd =
      selectedSheetWdValue == null
        ? quotation.SheetWidth
        : selectedSheetWdValue.label;
    let selectedSheetLn =
      selectedSheetLnValue == null
        ? quotation.SheetLength
        : selectedSheetLnValue.label;
    objGauge = gauges.filter((person) => person.Inches === selectedGauge);
    if (selectedGauge > 1) {
      _poundsPerSheet =
        selectedSheetWd *
        selectedSheetLn *
        (objGauge.length === 0 ? selectedGauge : objGauge[0].TrueInches) *
        0.2833;
    } else {
      _poundsPerSheet =
        selectedSheetWd *
        selectedSheetLn *
        (objGauge.length === 0
          ? parseFloat(selectedGauge)
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
      parseInt(userValues.txtNumberOfSheets) /
        (parseInt(userValues.txtMaxSkidWt) / _poundsPerSheet)
    );
    return _intNumSkids;
  };

  const coilPoundsNeeded = () => {
    let _poundsPerSheet = poundsPerSheet();
    return Math.round(_poundsPerSheet * parseInt(userValues.txtNumberOfSheets));
  };

  const numberOfCoilsNeeded = () => {
    let _coilsPoundNeeded = coilPoundsNeeded();
    return Math.ceil(_coilsPoundNeeded / poundsPerCoil);
  };

  const processingCostSheet = () => {
    let _SheetsPerMinute = sheetsPerMinute();
    let objLine = prodLines.filter(
      (person) => person.Code.trim() === selectedProdLine.label.trim()
    );
    let _dblProcessingCost =
      objLine[0].CostPerLine / (_SheetsPerMinute * 0.6 * 60);
    //__setProcessingCostPerSheet(parseFloat(_dblProcessingCost).toFixed(4));
    return parseFloat(_dblProcessingCost).toFixed(4);
  };

  const sheetsPerMinute = () => {
    let selectedGauge =
      selectedGaugeValue == null ? quotation.Gauge : selectedGaugeValue.label;
    let selectedSheetWd =
      selectedSheetWdValue == null
        ? quotation.SheetWidth
        : selectedSheetWdValue.label;
    let selectedSheetLn =
      selectedSheetLnValue == null
        ? quotation.SheetLength
        : selectedSheetLnValue.label;
    let obJPLP = prodLines.filter(
      (person) => person.Code.trim() === selectedProdLine.label.trim()
    );
    let objGauge = gauges.filter((person) => person.Inches === selectedGauge);
    let _dblSheetsPerMinute;
    if (selectedGauge > 1) {
      _dblSheetsPerMinute =
        obJPLP[0].Coeffecient +
        obJPLP[0].Thickness *
          (objGauge.length === 0 ? selectedGauge : objGauge[0].TrueInches) +
        obJPLP[0].Width * selectedSheetWd +
        obJPLP[0].Length * selectedSheetLn;
    } else {
      _dblSheetsPerMinute =
        obJPLP[0].Coeffecient +
        obJPLP[0].Thickness *
          (objGauge.length === 0
            ? parseFloat(selectedGauge)
            : objGauge[0].Inches) +
        obJPLP[0].Width * selectedSheetWd +
        obJPLP[0].Length * selectedSheetLn;
    }
    return _dblSheetsPerMinute;
  };

  const lineSetupLength = () => {
    let obJPLP = prodLines.filter(
      (person) => person.Code.trim() === selectedProdLine.label.trim()
    );
    return 1 * obJPLP[0].SetupLength;
  };

  const lineSetupThickness = () => {
    let obJPLP = prodLines.filter(
      (person) => person.Code.trim() === selectedProdLine.label.trim()
    );
    return 1 * obJPLP[0].SetupThickness;
  };

  const runToCompletion = () => {
    let obJPLP = prodLines.filter(
      (person) => person.Code.trim() === selectedProdLine.label.trim()
    );

    return runToFinish ? 0 : obJPLP[0].PullCoil;
  };

  const lineCoilSetup = () => {
    let obJPLP = prodLines.filter(
      (person) => person.Code.trim() === selectedProdLine.label.trim()
    );

    return 1 * obJPLP[0].CoilSetup;
  };
  const skidChangeoverTime = () => {
    let _numberOfSkids = numberOfSkidsNeeded();
    let obJPLP = prodLines.filter(
      (person) => person.Code.trim() === selectedProdLine.label.trim()
    );
    return _numberOfSkids * obJPLP[0].SkidTimeChange;
  };

  const lineSetupCostSheet = () => {
    let obJPLP = prodLines.filter(
      (person) => person.Code.trim() === selectedProdLine.label.trim()
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
    return parseFloat(
      _setUpCost / parseInt(userValues.txtNumberOfSheets)
    ).toFixed(4);
  };
  const materialCostPerSheet = () => {
    let _poundsPerSheet = poundsPerSheet();
    return parseInt(userValues.txtRepCost) > 0
      ? parseFloat(
          (_poundsPerSheet * parseInt(userValues.txtRepCost)) / 100
        ).toFixed(4)
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
    let selectedSheetWd =
      selectedSheetWdValue == null
        ? quotation.SheetWidth
        : selectedSheetWdValue.label;
    let selectedSheetLn =
      selectedSheetLnValue == null
        ? quotation.SheetLength
        : selectedSheetLnValue.label;
    let selectedSkidType =
      selectedSheetSkidTypeValue == null
        ? quotation.SkidType
        : selectedSheetSkidTypeValue.label.trim();
    let _numberOfSkidsNeeded = numberOfSkidsNeeded();
    let objSkidType = skidTypes.filter(
      (person) => person.Description.trim() === selectedSkidType
    );
    /* let selectedSheetLn = parseInt(selectedSheetLnValue.label);
    let selectedSheetWd = parseInt(selectedSheetWdValue.label); */
    if (selectedSheetLn <= 96) {
      if (selectedSheetWd <= 36) {
        objSkidType = skidTypes.filter(
          (person) => person.Width === 36 && person.Length === 96
        );
        _SkidCost = objSkidType[0].SkidCost;
      } else if (selectedSheetWd <= 48) {
        objSkidType = skidTypes.filter(
          (person) => person.Width === 48 && person.Length === 96
        );
        _SkidCost = objSkidType[0].SkidCost;
      } else if (selectedSheetWd <= 60) {
        objSkidType = skidTypes.filter(
          (person) => person.Width === 60 && person.Length === 96
        );
        _SkidCost = objSkidType[0].SkidCost;
      }
    } else if (selectedSheetLn <= 120) {
      if (selectedSheetWd <= 36) {
        objSkidType = skidTypes.filter(
          (person) => person.Width === 36 && person.Length === 120
        );
        _SkidCost = objSkidType[0].SkidCost;
      } else if (selectedSheetWd <= 48) {
        objSkidType = skidTypes.filter(
          (person) => person.Width === 48 && person.Length === 120
        );
        _SkidCost = objSkidType[0].SkidCost;
      } else if (selectedSheetWd <= 60) {
        objSkidType = skidTypes.filter(
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
    return parseFloat(
      _totalSkidCost / parseInt(userValues.txtNumberOfSheets)
    ).toFixed(4);
  };

  const paperWrapCostPerSheet = () => {
    let selectedSkidType =
      selectedSheetSkidTypeValue == null
        ? quotation.SkidType
        : selectedSheetSkidTypeValue.label.trim();
    let objSkidType = skidTypes.filter(
      (person) => person.Description.trim() === selectedSkidType
    );
    let _numberOfSkidsNeeded = numberOfSkidsNeeded();
    if (wrap) {
      return parseFloat(
        objSkidType === null || objSkidType.length === 0
          ? 20
          : (objSkidType[0].WrapCost * _numberOfSkidsNeeded) /
              userValues.txtNumberOfSheets
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
    if (wrap) {
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
    return parseFloat(
      parseInt(userValues.txtProposedPrice) - _totalCostPerCWT
    ).toFixed(4);
  };

  const percentMargin = () => {
    let _margin = margin();
    return parseFloat(
      (_margin / parseFloat(userValues.txtProposedPrice)) * 100
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
      parseInt(userValues.txtNumberOfSheets) / _sheetsPerMinute / 60
    ).toFixed(2);
  };

  const totalProductionHrs = () => {
    let _totalSetupHrs = parseFloat(totalSetupHrs());
    let _productionHrs = parseFloat(productionHrs());
    return parseFloat(_totalSetupHrs + _productionHrs).toFixed(2);
  };

  const setUpCost = () => {
    let _totalSetupTime = totalSetupTime();
    let obJPLP = prodLines.filter(
      (person) => person.Code.trim() === selectedProdLine.label.trim()
    );
    return parseFloat((_totalSetupTime / 60) * obJPLP[0].CostPerLine).toFixed(
      2
    );
  };

  //Merit Formulae method end here

  const handleInputChange = (event) => {
    /* switch(event.target.name){
      case "txtNumberOfSheets":

    } */

    setUserValues({
      ...userValues,
      [event.target.name]:
        event.target.name == "chkType"
          ? event.target.checked
          : event.target.value,
    });
    console.log(userValues);
  };

  const onDelete = () => {
    swal({
      title: "Are you sure?",
      text: "Do you want to delete this?",
      icon: "warning",
      dangerMode: true,
      buttons: ["No", "Yes"],
    }).then((willDelete) => {
      if (willDelete) {
        setDeleting(true);
        let objData = {};
        objData.id = parseInt(quotation.id);
        deleteCustomer(objData);
      }
    });
  };
  const deleteCustomer = async (data) => {
    try {
      const resp = await axios.delete(`/Quotation/${data.id}`);
      console.log(resp);
      setDeleting(false);
      swal({
        title: "Done!",
        text: "Quotation deleted!",
        icon: "success",
        timer: 2000,
        button: false,
      }).then(() => {
        //window.location.reload();
        history.push("/Quotations");
      });
    } catch (err) {
      console.log(err);
    }
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
      <div class="content-page">
        <div clas="content">
          <Animated
            animationIn="fadeIn"
            animationOut="fadeIn"
            animationInDuration={1500}
            isVisible={true}
          >
            <div class="container-fixed">
              <div class="row"></div>
              <AvForm id="frmInputQuote" onSubmit={handleSubmit} ref={frmInput}>
                <Row>
                  <Col lg={12}>
                    <div className="flex-container">
                      <h4 className="page-title">{`Edit Quotation # ${quotation.QuoteNumber}`}</h4>
                      <div className="action-container">
                        {!loading ? (
                          <Button
                            color="primary"
                            className="action-container__button"
                            type="submit"
                          >
                            Save
                          </Button>
                        ) : (
                          <Button
                            color="primary"
                            disabled
                            className="action-container__button"
                          >
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                            &nbsp; Saving...
                          </Button>
                        )}

                        <Button
                          color="secondary"
                          className="action-container__button"
                          onClick={() => history.goBack()}
                        >
                          Cancel
                        </Button>
                        {!deleting ? (
                          <Button
                            color="danger"
                            className="action-container__button"
                            onClick={onDelete}
                          >
                            Delete
                          </Button>
                        ) : (
                          <Button
                            color="danger"
                            disabled
                            className="action-container__button"
                          >
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                            &nbsp; Deleting...
                          </Button>
                        )}

                        <Button
                          color="primary"
                          className="action-container__button--back"
                          onClick={() => history.push("/Quotations")}
                        >
                          <MenuOpenIcon /> Back
                        </Button>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={6}>
                    <Card className="card.card-custom">
                      <CardBody>
                        <h4>Input</h4>

                        <Row style={rowStyle}>
                          <Col lg={3} xs={5}>
                            <label>Customer</label>
                          </Col>
                          <Col lg={3} xs={7}>
                            <Select
                              id="drdCustomers"
                              name="drdCustomers"
                              required
                              options={formattedCustomers}
                              value={selectedCustomer}
                              defaultValue={selectedCustomer}
                              onChange={handleChange}
                            />
                          </Col>
                        </Row>
                        <Row style={rowStyle}>
                          <Col lg={3} xs={5}>
                            <label>Sales Rep</label>
                          </Col>
                          <Col lg={3} xs={7}>
                            <Input
                              name="QuoteDate"
                              value={`${quotation.FirstName} ${quotation.LastName}`}
                              disabled
                              style={customTextBox}
                            ></Input>
                          </Col>
                        </Row>
                        <Row style={rowStyle}>
                          <Col lg={3} xs={5}>
                            <label>Quotation Date</label>
                          </Col>
                          <Col lg={3} xs={7}>
                            <Input
                              name="QuoteDate"
                              value={quotation.FormattedQuoteDate}
                              disabled
                              style={customTextBox}
                            ></Input>
                          </Col>
                        </Row>
                        <Row style={rowStyle}>
                          <Col lg={3} xs={5}>
                            <label>Production Line</label>
                          </Col>
                          <Col lg={3} xs={7}>
                            <Select
                              id="drdProdLines"
                              name="drdProdLines"
                              required
                              options={formattedproductionLines}
                              value={selectedProdLine}
                              defaultValue={selectedProdLine}
                              onChange={handleChange}
                            />
                          </Col>
                        </Row>
                        <Row style={rowStyle}>
                          <Col lg={3} xs={7}>
                            <label>Gauge</label>
                          </Col>
                          <Col lg={3} xs={5}>
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
                        </Row>
                        <Row style={rowStyle}>
                          <Col lg={3} xs={7}>
                            <label>Sheet Width (in.)</label>
                          </Col>
                          <Col lg={3} xs={5}>
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
                        </Row>
                        <Row style={rowStyle}>
                          <Col lg={3} xs={7}>
                            <label>Length</label>
                          </Col>
                          <Col lg={3} xs={5}>
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
                        </Row>
                        <Row style={rowStyle}>
                          <Col lg={3} xs={7}>
                            <label># Sheets</label>
                          </Col>
                          <Col lg={3} xs={5}>
                            <AvField
                              name="txtNumberOfSheets"
                              placeholder="# Sheets"
                              type="number"
                              value={quotation.NumberOfSheet}
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
                              onBlur={handleInputChange}
                            />
                          </Col>
                        </Row>
                        <Row style={rowStyle}>
                          <Col lg={3} xs={7}>
                            <label>Max Customer width per skid (lb.)</label>
                          </Col>
                          <Col lg={3} xs={5}>
                            <AvField
                              name="txtMaxSkidWt"
                              onBlur={handleInputChange}
                              value={quotation.MaxCustSkid}
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
                            />
                          </Col>
                        </Row>
                        <Row style={rowStyle}>
                          <Col lg={3} xs={7}>
                            <label>Replacement Cost</label>
                          </Col>
                          <Col lg={3} xs={5}>
                            <AvField
                              name="txtRepCost"
                              onBlur={handleInputChange}
                              value={quotation.ReplacementCost}
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
                        </Row>
                        <Row style={rowStyle}>
                          <Col lg={3} xs={7}>
                            <label>Paper/Plastic Wrap?</label>
                          </Col>
                          <Col lg={3} xs={5}>
                            <MuiThemeProvider theme={theme}>
                              <Switch
                                checked={wrap}
                                name="chkWrap"
                                color="primary"
                                onChange={handleWrap}
                              />
                            </MuiThemeProvider>
                          </Col>
                        </Row>
                        <Row style={rowStyle}>
                          <Col lg={3} xs={7}>
                            <label>Skid Type</label>
                          </Col>
                          <Col lg={3} xs={5}>
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
                        </Row>
                        <Row style={rowStyle}>
                          <Col lg={3} xs={7}>
                            <label>Proposed Price</label>
                          </Col>
                          <Col lg={3} xs={5}>
                            <AvField
                              name="txtProposedPrice"
                              onBlur={handleInputChange}
                              value={quotation.ProposedPriceCWT}
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
                            />
                          </Col>
                        </Row>
                        <Row style={rowStyle}>
                          <Col lg={3} xs={7}>
                            <label>Run to finish?</label>
                          </Col>
                          <Col lg={3} xs={5}>
                            <MuiThemeProvider theme={theme}>
                              <Switch
                                checked={runToFinish}
                                name="chkRunToFinish"
                                color="primary"
                                onChange={handleRunToFinish}
                              />
                            </MuiThemeProvider>
                          </Col>
                          <Col lg={1} xs={7} style={{ marginTop: 10 }}>
                            <label>Type</label>
                          </Col>
                          <Col lg={3} xs={5}>
                            <Typography component="div">
                              <Grid
                                component="label"
                                container
                                alignItems="center"
                                spacing={1}
                              >
                                <Grid
                                  item
                                  style={{
                                    fontFamily: "poppins",
                                    fontSize: 12,
                                  }}
                                >
                                  Draft
                                </Grid>
                                <Grid item>
                                  <MuiThemeProvider theme={theme}>
                                    <Switch
                                      checked={userValues.chkType}
                                      onChange={handleInputChange}
                                      name="chkType"
                                      color="primary"
                                    />
                                  </MuiThemeProvider>
                                </Grid>
                                <Grid
                                  item
                                  style={{
                                    fontFamily: "poppins",
                                    fontSize: 12,
                                  }}
                                >
                                  Final
                                </Grid>
                              </Grid>
                            </Typography>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col lg={6}>
                    <Card className="card.card-custom">
                      <CardBody>
                        <h4>Output</h4>
                        <Row style={rowStyle}>
                          <Col lg={6} xs={4}></Col>
                          <Col lg={3} xs={4} style={{ textAlign: "right" }}>
                            <b>Sheet Cost</b>
                          </Col>
                          <Col lg={3} xs={4} style={{ textAlign: "right" }}>
                            <b>Cost/cwt.</b>
                          </Col>
                        </Row>
                        <Row style={rowStyle}>
                          <Col lg={6} xs={4}>
                            Line Setup Cost
                          </Col>
                          <Col lg={3} xs={4}>
                            <AvField
                              name="LineSetupSheet"
                              className="numberRight"
                              value={`$ ${lineSetupCostSheet()}`}
                              disabled
                              style={customTextBox}
                            ></AvField>
                          </Col>
                          <Col lg={3} xs={4}>
                            <AvField
                              name="LineSetupCWT"
                              className="numberRight"
                              value={`$ ${lineSetupCostPerCWT()}`}
                              disabled
                              style={customTextBox}
                            ></AvField>
                          </Col>
                        </Row>
                        <Row style={rowStyle}>
                          <Col lg={6} xs={4}>
                            Processing Cost
                          </Col>
                          <Col lg={3} xs={4}>
                            <AvField
                              name="procCostSheet"
                              className="numberRight"
                              value={`$ ${processingCostSheet()}`}
                              disabled
                              style={customTextBox}
                            ></AvField>
                          </Col>
                          <Col lg={3} xs={4}>
                            <AvField
                              name="procCostCWT"
                              className="numberRight"
                              value={`$ ${processingCostPerCWT()}`}
                              disabled
                              style={customTextBox}
                            ></AvField>
                          </Col>
                        </Row>
                        <Row style={rowStyle}>
                          <Col lg={6} xs={4}>
                            Material Cost
                          </Col>
                          <Col lg={3} xs={4}>
                            <AvField
                              name="matCostSheet"
                              className="numberRight"
                              value={`$ ${materialCostPerSheet()}`}
                              disabled
                              style={customTextBox}
                            ></AvField>
                          </Col>
                          <Col lg={3} xs={4}>
                            <AvField
                              name="matCostCWT"
                              className="numberRight"
                              value={`$ ${materialCostPerCWT()}`}
                              disabled
                              style={customTextBox}
                            ></AvField>
                          </Col>
                        </Row>
                        <Row style={rowStyle}>
                          <Col lg={6} xs={4}>
                            Skid Cost
                          </Col>
                          <Col lg={3} xs={4}>
                            <AvField
                              name="skidCostSheet"
                              className="numberRight"
                              value={`$ ${skidCostPerSheet()}`}
                              disabled
                              style={customTextBox}
                            ></AvField>
                          </Col>
                          <Col lg={3} xs={4}>
                            <AvField
                              name="skidCostCWT"
                              className="numberRight"
                              value={`$ ${skidCostPerCWT()}`}
                              disabled
                              style={customTextBox}
                            ></AvField>
                          </Col>
                        </Row>
                        {wrap ? (
                          <Row style={rowStyle}>
                            <Col lg={6} xs={4}>
                              Paper Wrap
                            </Col>
                            <Col lg={3} xs={4}>
                              <AvField
                                name="wrapcostSheet"
                                className="numberRight"
                                value={`$ ${paperWrapCostPerSheet()}`}
                                disabled
                                style={customTextBox}
                              ></AvField>
                            </Col>
                            <Col lg={3} xs={4}>
                              <AvField
                                name="wrapCostCWT"
                                className="numberRight"
                                value={`$ ${paperWrapCostPerCWT()}`}
                                disabled
                                style={customTextBox}
                              ></AvField>
                            </Col>
                          </Row>
                        ) : (
                          <Row />
                        )}

                        <Row style={rowStyle}>
                          <Col lg={6} xs={4}>
                            Total Cost
                          </Col>
                          <Col lg={3} xs={4}>
                            <AvField
                              name="totCostSheet"
                              value={`$ ${totalCostPerSheet()}`}
                              disabled
                              style={customTextBoxComputationBold}
                            ></AvField>
                          </Col>
                          <Col lg={3} xs={4}>
                            <AvField
                              name="totCostCWT"
                              value={`$ ${totalCostPerCWT()}`}
                              disabled
                              style={customTextBoxComputationBold}
                            ></AvField>
                          </Col>
                        </Row>
                        <Row style={rowStyle}>
                          <Col lg={12}>
                            <Divider></Divider>
                          </Col>
                        </Row>

                        <Row style={rowStyle}>
                          <Col lg={6} xs={6}>
                            Proposed Price
                          </Col>
                          <Col lg={3} xs={2}></Col>
                          <Col lg={3} xs={4}>
                            <AvField
                              name="propPrice"
                              className="numberRight"
                              value={`$ ${userValues.txtProposedPrice}`}
                              disabled
                              style={customTextBox}
                            ></AvField>
                          </Col>
                        </Row>
                        <Row style={rowStyle}>
                          <Col lg={6} xs={6}>
                            Margin
                          </Col>
                          <Col lg={3} xs={2}></Col>
                          <Col lg={3} xs={4}>
                            <AvField
                              name="margin"
                              className="numberRight"
                              value={`$ ${margin()}`}
                              disabled
                              style={customTextBox}
                            ></AvField>
                          </Col>
                        </Row>
                        <Row style={rowStyle}>
                          <Col lg={6} xs={6}>
                            Percent Margin
                          </Col>
                          <Col lg={3} xs={2}></Col>
                          <Col lg={3} xs={4}>
                            <AvField
                              name="percentMargin"
                              className="numberRight"
                              value={`${percentMargin()} %`}
                              disabled
                              style={customTextBox}
                            ></AvField>
                          </Col>
                        </Row>
                        <Row style={rowStyle}>
                          <Col lg={6} xs={6}>
                            Total pounds
                          </Col>
                          <Col lg={3} xs={2}></Col>
                          <Col lg={3} xs={4}>
                            <AvField
                              name="totPounds"
                              className="numberRight"
                              value={totalPounds().toLocaleString()}
                              disabled
                              style={customTextBox}
                            ></AvField>
                          </Col>
                        </Row>
                        <Row style={rowStyle}>
                          <Col lg={6} xs={6}>
                            Prod Hrs.
                          </Col>
                          <Col lg={3} xs={2}></Col>
                          <Col lg={3} xs={4}>
                            <AvField
                              name="totProdHrs"
                              className="numberRight"
                              value={totalProductionHrs()}
                              disabled
                              style={customTextBox}
                            ></AvField>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </AvForm>
              {/* <Row>
                <Col lg={12}>
                  <div className="flex-container">
                    {currentIndex > 0 ? (
                      <Button
                        outline
                        color="primary"
                        className="quotation__button"
                        onClick={() => goToPrevQuotation()}
                      >
                        <ChevronLeftIcon /> Prev
                      </Button>
                    ) : (
                      <Button
                        disabled
                        outline
                        color="primary"
                        className="quotation__button"
                      >
                        <ChevronLeftIcon /> Prev
                      </Button>
                    )}
                    {currentIndex < history.location.state.length - 1 ? (
                      <Button
                        outline
                        color="primary"
                        className="quotation__button"
                        onClick={() => goToNextQuotation()}
                      >
                        <ChevronRightIcon /> Next
                      </Button>
                    ) : (
                      <Button
                        outline
                        disabled
                        color="primary"
                        className="quotation__button"
                        onClick={() => history.push("/Quotations")}
                      >
                        <ChevronRightIcon /> Next
                      </Button>
                    )}
                  </div>
                </Col>
              </Row> */}
            </div>
          </Animated>
        </div>
      </div>
    );
  }
}

export default EditQuotation;
