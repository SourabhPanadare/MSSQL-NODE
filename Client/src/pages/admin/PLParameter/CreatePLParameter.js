import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Animated } from "react-animated-css";
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
import axios from "../../../axios";
import PageLoader from "../../../components/PageLoader";
import swal from "sweetalert";
import Select from "react-select";
import "../../../assets/css/PLParameter.css";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import Switch from "@material-ui/core/Switch";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import "../../../assets/css/Common.css";

function CreatePLParameter() {
  const frmInput = useRef(null);
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [PLParameters, setPLParameters] = useState(history.location.state);
  const [formattedPLCodes, setFormattedPLCodes] = useState([]);
  const [selectedPLCodes, setSelectedPLCodes] = useState();
  const [pageLoading, setPageLoading] = useState(true);
  const [descErrorMsg, setDescErrorMsg] = useState("This field is required");
  const [codeError, setCodeError] = useState(0);
  useEffect(() => {
    async function fetchProdLineCodes() {
      try {
        const response = await axios.get("/PLCodes/v2");
        const arrList = response.data[0];
        var arrFormattedList = arrList.map((element) => ({
          value: element.ProductionLineID,
          label: element.Code,
        }));
        setFormattedPLCodes(arrFormattedList);
        setPageLoading(false);
        return response;
      } catch (error) {
        console.error();
      }
    }
    fetchProdLineCodes();
  }, []);
  const handleChange = (newValue, actionMeta) => {
    setSelectedPLCodes(newValue);
    setCodeError(0);
  };
  const handleSubmit = (event, errors, values) => {
    if (selectedPLCodes == null) {
      errors.push("drdPLCodes");
      setCodeError(1);
    } else {
      setCodeError(0);
    }
    if (errors.length == 0) {
      swal({
        title: "Are you sure?",
        text: "Do you want to save this?",
        icon: "warning",
        dangerMode: false,
        buttons: ["No", "Yes"],
      }).then((willSave) => {
        if (willSave) {
          setLoading(true);
          let objData = {};
          objData.ProdLineID = selectedPLCodes.value;
          objData.Code = selectedPLCodes.label;
          objData.Coeffecient = values.txtCoeffecient;
          objData.Length = values.txtLength;
          objData.Thickness = values.txtThickness;
          objData.Width = values.txtWidth;
          objData.SetupLength = values.txtSetupLength;
          objData.SetupThickness = values.txtSetupThickness;
          objData.CoilSetup = values.txtCoilSetup;
          objData.SkidTimeChange = values.txtSkidTimeChange;
          objData.PullCoil = values.txtPullCoil;
          objData.LineMaxSkidWidth = values.txtLineMaxSkidWidth;
          objData.CostPerLine = values.txtCostPerLine;
          savePLParameter(objData);
        }
      });
    }
  };
  const savePLParameter = async (data) => {
    try {
      const resp = await axios.post("/PLParameter", data);
      console.log(resp);
      setLoading(false);
      swal({
        title: "Done!",
        text: "Product Line Parameters saved!",
        icon: "success",
        timer: 2000,
        button: false,
      }).then(() => {
        //window.location.reload();
        //history.goBack();
        history.push("/PLParameter/List");
      });
    } catch (err) {
      console.log(err);
    }
  };
  const resetForm = () => {
    frmInput.current.reset();
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
      <Animated
        animationIn="fadeIn"
        animationOut="fadeIn"
        animationInDuration={1500}
        isVisible={true}
      >
        <React.Fragment>
          <Row>
            <Col lg={12}>
              <div className="flex-container">
                <h4 className="page-title">Add Production Line Parameters</h4>
                <Button
                  color="primary"
                  className="quotation__button"
                  onClick={() => history.push("/PLParameter/List")}
                >
                  <MenuOpenIcon /> Back
                </Button>
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
                        <label>Code</label>
                      </Col>
                      <Col lg={2} style={{ marginBottom: 20 }}>
                        {codeError == 0 ? (
                          <Select
                            id="drdPLCodes"
                            name="drdPLCodes"
                            required
                            options={formattedPLCodes}
                            onChange={handleChange}
                            value={selectedPLCodes}
                          />
                        ) : (
                          <div>
                            <Select
                              id="drdPLCodes"
                              name="drdPLCodes"
                              required
                              options={formattedPLCodes}
                              onChange={handleChange}
                              value={selectedPLCodes}
                              className="error"
                            />
                            <span className="error__span">
                              This field is required.
                            </span>
                          </div>
                        )}
                      </Col>
                      <Col lg={2} />
                    </Row>
                    <Row>
                      <Col lg={3} />
                      <Col lg={2}>
                        <label>Coeffecient</label>
                      </Col>
                      <Col lg={2}>
                        <AvField
                          name="txtCoeffecient"
                          type="number"
                          max="600"
                          required
                          validate={{
                            required: {
                              value: true,
                              errorMessage: "This field is required",
                            },
                            max: {
                              value: 600,
                              errorMessage:
                                "Please enter a value between 1 and 600",
                            },
                          }}
                        />
                      </Col>
                      <Col lg={2} />
                    </Row>
                    <Row>
                      <Col lg={3} />
                      <Col lg={2}>
                        <label>Length</label>
                      </Col>
                      <Col lg={2}>
                        <AvField
                          name="txtLength"
                          type="number"
                          max="600"
                          required
                          validate={{
                            required: {
                              value: true,
                              errorMessage: "This field is required",
                            },
                            max: {
                              value: 600,
                              errorMessage:
                                "Please enter a value between 1 and 600",
                            },
                          }}
                        />
                      </Col>
                      <Col lg={2} />
                    </Row>
                    <Row>
                      <Col lg={3} />
                      <Col lg={2}>
                        <label>Thickness</label>
                      </Col>
                      <Col lg={2}>
                        <AvField
                          name="txtThickness"
                          type="number"
                          max="600"
                          required
                          validate={{
                            required: {
                              value: true,
                              errorMessage: "This field is required",
                            },
                            max: {
                              value: 600,
                              errorMessage:
                                "Please enter a value between 1 and 600",
                            },
                          }}
                        />
                      </Col>
                      <Col lg={2} />
                    </Row>
                    <Row>
                      <Col lg={3} />
                      <Col lg={2}>
                        <label>Width</label>
                      </Col>
                      <Col lg={2}>
                        <AvField
                          name="txtWidth"
                          type="number"
                          max="600"
                          required
                          validate={{
                            required: {
                              value: true,
                              errorMessage: "This field is required",
                            },
                            max: {
                              value: 600,
                              errorMessage:
                                "Please enter a value between 1 and 600",
                            },
                          }}
                        />
                      </Col>
                      <Col lg={2} />
                    </Row>
                    <Row>
                      <Col lg={3} />
                      <Col lg={2}>
                        <label>Setup Length</label>
                      </Col>
                      <Col lg={2}>
                        <AvField
                          name="txtSetupLength"
                          type="number"
                          max="60"
                          required
                          validate={{
                            required: {
                              value: true,
                              errorMessage: "This field is required",
                            },
                            max: {
                              value: 60,
                              errorMessage:
                                "Please enter a value between 1 and 60",
                            },
                          }}
                        />
                      </Col>
                      <Col lg={2} />
                    </Row>
                    <Row>
                      <Col lg={3} />
                      <Col lg={2}>
                        <label>Setup Thickness</label>
                      </Col>
                      <Col lg={2}>
                        <AvField
                          name="txtSetupThickness"
                          type="number"
                          max="60"
                          required
                          validate={{
                            required: {
                              value: true,
                              errorMessage: "This field is required",
                            },
                            max: {
                              value: 60,
                              errorMessage:
                                "Please enter a value between 1 and 60",
                            },
                          }}
                        />
                      </Col>
                      <Col lg={2} />
                    </Row>
                    <Row>
                      <Col lg={3} />
                      <Col lg={2}>
                        <label>Coil Setup</label>
                      </Col>
                      <Col lg={2}>
                        <AvField
                          name="txtCoilSetup"
                          type="number"
                          max="60"
                          required
                          validate={{
                            required: {
                              value: true,
                              errorMessage: "This field is required",
                            },
                            max: {
                              value: 60,
                              errorMessage:
                                "Please enter a value between 1 and 60",
                            },
                          }}
                        />
                      </Col>
                      <Col lg={2} />
                    </Row>
                    <Row>
                      <Col lg={3} />
                      <Col lg={2}>
                        <label>Skid Time Change</label>
                      </Col>
                      <Col lg={2}>
                        <AvField
                          name="txtSkidTimeChange"
                          type="number"
                          max="60"
                          required
                          validate={{
                            required: {
                              value: true,
                              errorMessage: "This field is required",
                            },
                            max: {
                              value: 60,
                              errorMessage:
                                "Please enter a value between 1 and 60",
                            },
                          }}
                        />
                      </Col>
                      <Col lg={2} />
                    </Row>
                    <Row>
                      <Col lg={3} />
                      <Col lg={2}>
                        <label>Pull Coil</label>
                      </Col>
                      <Col lg={2}>
                        <AvField
                          name="txtPullCoil"
                          type="number"
                          max="600"
                          required
                          validate={{
                            required: {
                              value: true,
                              errorMessage: "This field is required",
                            },
                            max: {
                              value: 600,
                              errorMessage:
                                "Please enter a value between 1 and 600",
                            },
                          }}
                        />
                      </Col>
                      <Col lg={2} />
                    </Row>
                    <Row>
                      <Col lg={3} />
                      <Col lg={2}>
                        <label>Line Max SkidWidth</label>
                      </Col>
                      <Col lg={2}>
                        <AvField
                          name="txtLineMaxSkidWidth"
                          type="number"
                          main="1"
                          max="10000"
                          required
                          validate={{
                            required: {
                              value: true,
                              errorMessage: "This field is required",
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
                      <Col lg={2} />
                    </Row>
                    <Row>
                      <Col lg={3} />
                      <Col lg={2}>
                        <label>Cost Per Line</label>
                      </Col>
                      <Col lg={2}>
                        <AvField
                          name="txtCostPerLine"
                          type="number"
                          min="1"
                          max="1000"
                          required
                          validate={{
                            required: {
                              value: true,
                              errorMessage: "This field is required",
                            },
                            min: {
                              value: 1,
                              errorMessage:
                                "Please enter a value between 1 and 1000",
                            },
                            max: {
                              value: 1000,
                              errorMessage:
                                "Please enter a value between 1 and 1000",
                            },
                          }}
                        />
                      </Col>
                      <Col lg={2} />
                    </Row>
                    <Row>
                      <Col lg={5} />
                      {!loading ? (
                        <Col lg={1} xs={6}>
                          <Button color="primary" className="btn-block">
                            Save
                          </Button>
                        </Col>
                      ) : (
                        <Col lg={1} xs={6}>
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
        </React.Fragment>
      </Animated>
    );
  }
}

export default CreatePLParameter;
