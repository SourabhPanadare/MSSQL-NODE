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
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
function PLParameter(props) {
  const frmInput = useRef(null);
  const history = useHistory();
  const [PLParameter, setPLParameter] = useState({});
  const [formattedPLCodes, setFormattedPLCodes] = useState([]);
  const [selectedPLCodes, setSelectedPLCodes] = useState();
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchPLParameter() {
      try {
        const response = await axios.get(
          `/PLParameter/${parseInt(props.match.params.id)}?cb=${Date.now()}`
        );
        setPLParameter(response.data[0]);
        const responsePLCode = await axios.get("/PLCodes");
        const arrList = responsePLCode.data;
        var arrFormattedList = arrList.map((element) => ({
          value: element.ProductionLineID,
          label: element.Code,
        }));
        setFormattedPLCodes(arrFormattedList);
        let objSelectedPLCode = arrFormattedList.filter(
          (element) => element.value === response.data[0].ProdLineID
        );
        setSelectedPLCodes(objSelectedPLCode[0]);
        setPageLoading(false);
        return response;
      } catch (error) {
        console.error();
      }
    }
    fetchPLParameter();
  }, []);

  const handleSubmit = (event, errors, values) => {
    console.log(errors);
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
          objData.ID = parseInt(PLParameter.PLPID);
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
      const resp = await axios.put("/PLParameter", data);
      console.log(resp);
      setLoading(false);
      swal({
        title: "Done!",
        text: "Production Line Parameters saved!",
        icon: "success",
        timer: 2000,
        button: false,
      }).then(() => {
        //window.location.reload();
        history.goBack();
      });
    } catch (err) {
      console.log(err);
    }
  };
  const handleChange = (newValue, actionMeta) => {
    setSelectedPLCodes(newValue);
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
        objData.id = parseInt(PLParameter.PLPID);
        deletePLParameter(objData);
      }
    });
  };
  const deletePLParameter = async (data) => {
    try {
      const resp = await axios.delete(`/PLParameter/${data.id}`);
      console.log(resp);
      setDeleting(false);
      swal({
        title: "Done!",
        text: "Production Line Parameters deleted!",
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
    window.location.reload();
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
                <h4 className="page-title">Edit Production Line Parameters</h4>
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
                        <Select
                          id="drdPLCodes"
                          name="drdPLCodes"
                          required
                          isDisabled="true"
                          options={formattedPLCodes}
                          onChange={handleChange}
                          value={selectedPLCodes}
                          defaultValue={selectedPLCodes}
                        />
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
                          value={PLParameter.Coeffecient}
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
                          value={PLParameter.Length}
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
                          value={PLParameter.Thickness}
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
                          value={PLParameter.Width}
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
                          value={PLParameter.SetupLength}
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
                        {PLParameter.SetupThickness == 0 ? (
                          <AvField
                            name="txtSetupThickness"
                            type="number"
                            value={PLParameter.SetupThickness.toString()}
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
                        ) : (
                          <AvField
                            name="txtSetupThickness"
                            type="number"
                            value={PLParameter.SetupThickness}
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
                        )}
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
                          value={PLParameter.CoilSetup}
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
                          value={PLParameter.SkidTimeChange}
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
                          value={PLParameter.PullCoil}
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
                          value={PLParameter.LineMaxSkidWidth}
                          min="1"
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
                          value={PLParameter.CostPerLine}
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
                      {!deleting ? (
                        <Col lg={1} xs={6}>
                          <Button
                            color="danger"
                            className="btn-block"
                            onClick={onDelete}
                          >
                            Delete
                          </Button>
                        </Col>
                      ) : (
                        <Col lg={1} xs={6}>
                          <Button color="danger" disabled>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                            &nbsp; Deleting...
                          </Button>
                        </Col>
                      )}
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

export default PLParameter;
