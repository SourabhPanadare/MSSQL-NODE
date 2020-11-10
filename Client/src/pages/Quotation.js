import React, { useState, useEffect } from "react";
import { Divider } from "@material-ui/core";
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
import "../assets/css/Quotation.css";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { useHistory, useLocation } from "react-router-dom";
import axios from "../axios";
import PageLoader from "../components/PageLoader";
import { Animated } from "react-animated-css";
const rowStyle = {
  marginTop: 20,
};
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

function Quotation(props) {
  const history = useHistory();
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
  //setCurrentQuotation(parseInt(props.match.params.id));
  //setFilteredQuotations(filteredQuoteIDs);
  useEffect(() => {
    async function fetchQuotation() {
      try {
        const response = await axios.get(
          `/Quotation/${props.match.params.id}?cb=${Date.now()}`
        );
        setQuotation(response.data[0][0]);
        setCurrentQuotation(parseInt(props.match.params.id));
        setTotalQuotations(history.location.state.length);

        setPageLoading(false);
        return response;
      } catch (error) {
        console.error();
      }
    }
    fetchQuotation();
  }, []);

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
              <Row>
                <Col lg={12}>
                  <div className="flex-container">
                    <h4 className="page-title">{`Quotation # ${quotation.QuoteNumber}`}</h4>
                    <Button
                      color="primary"
                      className="quotation__button"
                      onClick={() => history.push("/Quotations")}
                    >
                      <MenuOpenIcon /> Back
                    </Button>
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
                          <Input
                            name="selectedCustomer"
                            value={quotation.Customer}
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
                          <Input
                            name="ProdLine"
                            value={quotation.ProductionLineCode}
                            disabled
                            style={customTextBox}
                          ></Input>
                        </Col>
                      </Row>
                      <Row style={rowStyle}>
                        <Col lg={3} xs={7}>
                          <label>Gauge</label>
                        </Col>
                        <Col lg={3} xs={5}>
                          <Input
                            name="Gauge"
                            className="numberRight"
                            value={quotation.Gauge}
                            disabled
                            style={customTextBox}
                          ></Input>
                        </Col>
                      </Row>
                      <Row style={rowStyle}>
                        <Col lg={3} xs={7}>
                          <label>Sheet Width (in.)</label>
                        </Col>
                        <Col lg={3} xs={5}>
                          <Input
                            className="numberRight"
                            name="SheetWidth"
                            value={quotation.SheetWidth}
                            disabled
                            style={customTextBox}
                          ></Input>
                        </Col>
                      </Row>
                      <Row style={rowStyle}>
                        <Col lg={3} xs={7}>
                          <label>Length</label>
                        </Col>
                        <Col lg={3} xs={5}>
                          <Input
                            className="numberRight"
                            name="SheetLength"
                            value={quotation.SheetLength}
                            disabled
                            style={customTextBox}
                          ></Input>
                        </Col>
                      </Row>
                      <Row style={rowStyle}>
                        <Col lg={3} xs={7}>
                          <label># Sheets</label>
                        </Col>
                        <Col lg={3} xs={5}>
                          <Input
                            className="numberRight"
                            name="NumberOfSheets"
                            value={quotation.NumberOfSheet}
                            disabled
                            style={customTextBox}
                          ></Input>
                        </Col>
                      </Row>
                      <Row style={rowStyle}>
                        <Col lg={3} xs={7}>
                          <label>Max Customer width per skid (lb.)</label>
                        </Col>
                        <Col lg={3} xs={5}>
                          <Input
                            className="numberRight"
                            name="MaxCustSkid"
                            value={quotation.MaxCustSkid}
                            disabled
                            style={customTextBox}
                          ></Input>
                        </Col>
                      </Row>
                      <Row style={rowStyle}>
                        <Col lg={3} xs={7}>
                          <label>Replacement Cost</label>
                        </Col>
                        <Col lg={3} xs={5}>
                          <Input
                            className="numberRight"
                            name="RepCost"
                            value={`$ ${quotation.ReplacementCost}`}
                            disabled
                            style={customTextBox}
                          ></Input>
                        </Col>
                      </Row>
                      <Row style={rowStyle}>
                        <Col lg={3} xs={7}>
                          <label>Paper/Plastic Wrap?</label>
                        </Col>
                        <Col lg={3} xs={5}>
                          <Input
                            name="Wrap"
                            value={quotation.PaperPlasticWrap ? "Yes" : "No"}
                            disabled
                            style={customTextBox}
                          ></Input>
                        </Col>
                      </Row>
                      <Row style={rowStyle}>
                        <Col lg={3} xs={7}>
                          <label>Skid Type</label>
                        </Col>
                        <Col lg={3} xs={5}>
                          <Input
                            name="SkidType"
                            value={quotation.SkidType}
                            disabled
                            style={customTextBox}
                          ></Input>
                        </Col>
                      </Row>
                      <Row style={rowStyle}>
                        <Col lg={3} xs={7}>
                          <label>Run to finish?</label>
                        </Col>
                        <Col lg={3} xs={5}>
                          <Input
                            name="RunToFinish"
                            value={quotation.RunToFinish ? "Yes" : "No"}
                            disabled
                            style={customTextBox}
                          ></Input>
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
                        <Col lg={3} xs={4}>
                          <b>Sheet Cost</b>
                        </Col>
                        <Col lg={3} xs={4}>
                          <b>Cost/cwt.</b>
                        </Col>
                      </Row>
                      <Row style={rowStyle}>
                        <Col lg={6} xs={4}>
                          Line Setup Cost
                        </Col>
                        <Col lg={3} xs={4}>
                          <Input
                            className="numberRight"
                            value={`$ ${quotation.LineSetupCostSheet}`}
                            disabled
                            style={customTextBox}
                          ></Input>
                        </Col>
                        <Col lg={3} xs={4}>
                          <Input
                            className="numberRight"
                            value={`$ ${quotation.LineSetupCostCWT}`}
                            disabled
                            style={customTextBox}
                          ></Input>
                        </Col>
                      </Row>
                      <Row style={rowStyle}>
                        <Col lg={6} xs={4}>
                          Processing Cost
                        </Col>
                        <Col lg={3} xs={4}>
                          <Input
                            className="numberRight"
                            value={`$ ${quotation.ProcessingCostSheet}`}
                            disabled
                            style={customTextBox}
                          ></Input>
                        </Col>
                        <Col lg={3} xs={4}>
                          <Input
                            className="numberRight"
                            value={`$ ${quotation.ProcessingCostCWT}`}
                            disabled
                            style={customTextBox}
                          ></Input>
                        </Col>
                      </Row>
                      <Row style={rowStyle}>
                        <Col lg={6} xs={4}>
                          Material Cost
                        </Col>
                        <Col lg={3} xs={4}>
                          <Input
                            className="numberRight"
                            value={`$ ${quotation.MaterialCostSheet}`}
                            disabled
                            style={customTextBox}
                          ></Input>
                        </Col>
                        <Col lg={3} xs={4}>
                          <Input
                            className="numberRight"
                            value={`$ ${quotation.MaterialCostCWT}`}
                            disabled
                            style={customTextBox}
                          ></Input>
                        </Col>
                      </Row>
                      <Row style={rowStyle}>
                        <Col lg={6} xs={4}>
                          Skid Cost
                        </Col>
                        <Col lg={3} xs={4}>
                          <Input
                            className="numberRight"
                            value={`$ ${quotation.SkidCostSheet}`}
                            disabled
                            style={customTextBox}
                          ></Input>
                        </Col>
                        <Col lg={3} xs={4}>
                          <Input
                            className="numberRight"
                            value={`$ ${quotation.SkidCostCWT}`}
                            disabled
                            style={customTextBox}
                          ></Input>
                        </Col>
                      </Row>
                      <Row style={rowStyle}>
                        <Col lg={6} xs={4}>
                          Paper Wrap
                        </Col>
                        <Col lg={3} xs={4}>
                          <Input
                            className="numberRight"
                            value={`$ ${quotation.PaperWrapCostSheet}`}
                            disabled
                            style={customTextBox}
                          ></Input>
                        </Col>
                        <Col lg={3} xs={4}>
                          <Input
                            className="numberRight"
                            value={`$ ${quotation.PaperWrapCostCWT}`}
                            disabled
                            style={customTextBox}
                          ></Input>
                        </Col>
                      </Row>
                      <Row style={rowStyle}>
                        <Col lg={6} xs={4}>
                          Total Cost
                        </Col>
                        <Col lg={3} xs={4}>
                          <Input
                            value={`$ ${quotation.TotalCostSheet}`}
                            disabled
                            style={customTextBoxComputationBold}
                          ></Input>
                        </Col>
                        <Col lg={3} xs={4}>
                          <Input
                            value={`$ ${quotation.TotalCostCWT}`}
                            disabled
                            style={customTextBoxComputationBold}
                          ></Input>
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
                          <Input
                            className="numberRight"
                            value={`$ ${quotation.ProposedPriceCWT}`}
                            disabled
                            style={customTextBox}
                          ></Input>
                        </Col>
                      </Row>
                      <Row style={rowStyle}>
                        <Col lg={6} xs={6}>
                          Margin
                        </Col>
                        <Col lg={3} xs={2}></Col>
                        <Col lg={3} xs={4}>
                          <Input
                            className="numberRight"
                            value={`$ ${quotation.Margin}`}
                            disabled
                            style={customTextBox}
                          ></Input>
                        </Col>
                      </Row>
                      <Row style={rowStyle}>
                        <Col lg={6} xs={6}>
                          Percent Margin
                        </Col>
                        <Col lg={3} xs={2}></Col>
                        <Col lg={3} xs={4}>
                          <Input
                            className="numberRight"
                            value={`${quotation.PercentMargin} %`}
                            disabled
                            style={customTextBox}
                          ></Input>
                        </Col>
                      </Row>
                      <Row style={rowStyle}>
                        <Col lg={6} xs={6}>
                          Total pounds
                        </Col>
                        <Col lg={3} xs={2}></Col>
                        <Col lg={3} xs={4}>
                          <Input
                            className="numberRight"
                            value={`${quotation.TotalPounds}`}
                            disabled
                            style={customTextBox}
                          ></Input>
                        </Col>
                      </Row>
                      <Row style={rowStyle}>
                        <Col lg={6} xs={6}>
                          Prod Hrs.
                        </Col>
                        <Col lg={3} xs={2}></Col>
                        <Col lg={3} xs={4}>
                          <Input
                            className="numberRight"
                            value={quotation.TotalProdHrs}
                            disabled
                            style={customTextBox}
                          ></Input>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <Row>
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
              </Row>
            </div>
          </Animated>
        </div>
      </div>
    );
  }
}

export default Quotation;
