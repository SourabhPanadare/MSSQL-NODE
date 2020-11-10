import React, { useState, useEffect, useRef } from "react";
import axios from "../../../axios";
import { MDBDataTableV5 } from "mdbreact";
import {
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Card,
  CardBody,
  Spinner,
} from "reactstrap";
import PageLoader from "../../../components/PageLoader";
import { Animated } from "react-animated-css";
import AddIcon from "@material-ui/icons/Add";
import { AvForm, AvField } from "availity-reactstrap-validation";
import swal from "sweetalert";
import Select from "react-select";
function ManageGaugeList() {
  const frmInput = useRef(null);
  const [ManageGauges, setManageGauges] = useState([]);
  const [ManageGauge, setManageGauge] = useState([]);
  const [formattedManageGauge, setFormattedManageGauge] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [formattedSortValues, setFormattedSortValues] = useState([]);
  const [selectedSortValue, setSelectedSortValue] = useState(null);
  const [formattedSortEditValues, setFormattedSortEditValues] = useState([]);
  const [selectedSortEditValue, setSelectedSortEditValue] = useState(null);
  const [descErrorMsg, setDescErrorMsg] = useState("This field is required");
  const data = {
    columns: [
      {
        label: "Gauge Inches",
        field: "Inches",
      },
      {
        label: "Gauge Sort Value",
        field: "SortValue",
      },
      {
        label: "Gauge True Inches",
        field: "TrueInches",
      },
    ],
    rows: formattedManageGauge,
  };
  useEffect(() => {
    async function fetchManageGauge() {
      try {
        let apiURL = `/ManageGauge?cb=${Date.now()}`;
        const response = await axios.get(apiURL);
        const arrList = response.data;
        var arrFormattedList = arrList.map((element) => ({
          id: element.GaugeID,
          Inches: element.Inches,
          SortValue: element.SortValue,
          TrueInches: element.TrueInches,
          clickEvent: (e) => handleClick(e, element, arrList),
        }));
        setManageGauges(response.data);
        setFormattedManageGauge(arrFormattedList);

        let apiSortURL = `/SortValues/ManageGauge?cb=${Date.now()}`;
        const responseSortValue = await axios.get(apiSortURL);
        generateSortValueArray(responseSortValue.data);

        setPageLoading(false);
        return response;
      } catch (error) {
        console.error();
      }
    }
    fetchManageGauge();
  }, []);

  const generateSortValueArray = (results) => {
    var arrFormattedSortValues = results.map((element) => ({
      value: element.SortValueID,
      label: element.SortValue,
    }));
    setFormattedSortValues(arrFormattedSortValues);
    setSelectedSortValue(arrFormattedSortValues[0]);
  };
  const generateSortValueEditArray = async (id, match) => {
    let apiSortURL = `/ManageGauge/${id}?cb=${Date.now()}`;
    const responseSortValue = await axios.get(apiSortURL);

    var arrFormattedSortValues = responseSortValue.data.map((element) => ({
      value: element.SortValueID,
      label: element.SortValue,
    }));
    setFormattedSortEditValues(arrFormattedSortValues);

    let objFound = arrFormattedSortValues.filter(
      (element) => element.label.trim() === match
    );

    setSelectedSortEditValue(objFound[0]);
  };
  const handleClick = (e, data, list) => {
    console.log("event target:", e.target, "data:", data);
    setManageGauge(data);
    setIsEdit(true);
    toggle();
    if (data.Inches < 1) {
      setIsAllowed(false);
    } else {
      setIsAllowed(true);
    }
    generateSortValueEditArray(data.GaugeID, data.SortValue.trim());
    //history.push(`/Customer/${data}`);

    //history.push("/Customer");
  };
  const handleChange = (newValue, actionMeta) => {
    if (actionMeta < 1) {
      setIsAllowed(false);
    } else {
      setIsAllowed(true);
    }
  };
  const handleSortChange = (newValue, actionMeta) => {
    setSelectedSortValue(newValue);
  };
  const handleSortEditChange = (newValue, actionMeta) => {
    setSelectedSortEditValue(newValue);
  };
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
          if (isEdit) {
            objData.ID = ManageGauge.GaugeID;
          }
          objData.Inches = values.txtInches;
          //objData.SortValue = values.txtSortValue;
          objData.SortValue = isEdit
            ? selectedSortEditValue.label.trim()
            : selectedSortValue.label.trim();
          objData.TrueInches = values.txtTrueInches;
          saveManageGauge(objData);
        }
      });
    }
  };
  const saveManageGauge = async (data) => {
    try {
      const resp = isEdit
        ? await axios.put("/ManageGauge", data)
        : await axios.post("/ManageGauge", data);
      console.log(resp);
      setLoading(false);
      swal({
        title: "Done!",
        text: "Gauge saved!",
        icon: "success",
        timer: 2000,
        button: false,
      }).then(() => {
        toggle();
        window.location.reload();
      });
    } catch (err) {
      console.log(err);
    }
  };
  const toggle = () => setModal(!modal);
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
        objData.ID = ManageGauge.GaugeID;
        deleteManageGauge(objData);
      }
    });
  };
  const deleteManageGauge = async (data) => {
    try {
      const resp = await axios.delete(`/ManageGauge/${data.ID}`);
      console.log(resp);
      setDeleting(false);
      swal({
        title: "Done!",
        text: "Gauge deleted!",
        icon: "success",
        timer: 2000,
        button: false,
      }).then(() => {
        toggle();
        window.location.reload();
      });
    } catch (err) {
      console.log(err);
    }
  };
  const validateName = (value, ctx, input, cb) => {
    let duplicateGauge = [];
    if (!isEdit) {
      duplicateGauge = ManageGauges.filter(
        (element) => element.Inches == value
      );
    } else {
      if (value != ManageGauge.Inches) {
        duplicateGauge = ManageGauges.filter(
          (element) => element.Inches == value
        );
      }
    }

    if (duplicateGauge.length > 0) {
      setDescErrorMsg("This field should be unique.");
      cb(false);
    } else {
      //setDescErrorMsg("This field is invalid.hfjhfjhjfh");
      cb(true);
    }
    return;
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
                  <h4 className="page-title">Manage Gauge</h4>
                  <Button
                    lg={3}
                    color="primary"
                    className="quotation__button"
                    onClick={() => {
                      setIsEdit(false);
                      toggle();
                    }}
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
            <AvForm id="frmInput" onSubmit={handleSubmit} ref={frmInput}>
              <Modal isOpen={modal} toggle={toggle}>
                {!isEdit ? (
                  <ModalHeader toggle={toggle}>Add Gauge</ModalHeader>
                ) : (
                  <ModalHeader toggle={toggle}>Edit Gauge</ModalHeader>
                )}
                <ModalBody>
                  <div>
                    <Row>
                      <Col lg={12}>
                        <Card lg={12}>
                          <CardBody>
                            {!isEdit ? (
                              <>
                                <Row>
                                  <Col lg={4}>
                                    <label class="mt-1 mb-0">Inches</label>
                                  </Col>
                                  <Col lg={8}>
                                    <AvField
                                      name="txtInches"
                                      type="number"
                                      min="0.0001"
                                      max="256"
                                      step="0.0001"
                                      required
                                      onChange={handleChange}
                                      validate={{
                                        custom: validateName,
                                        required: {
                                          value: true,
                                          errorMessage:
                                            "This field is required",
                                        },
                                        min: {
                                          value: 0.0001,
                                          errorMessage:
                                            "Please enter a value between 0.0001 and 256",
                                        },
                                        max: {
                                          value: 256,
                                          errorMessage:
                                            "Please enter a value between 0.0001 and 256",
                                        },
                                      }}
                                      errorMessage={descErrorMsg}
                                    />
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={4}>
                                    <label class="mt-1 mb-0">Sort Value</label>
                                  </Col>
                                  <Col lg={8} style={{ marginBottom: 20 }}>
                                    {/* <AvField
                                    name="txtSortValue"
                                    type="text"
                                    required
                                    placeholder="A-Z or a-z"
                                    validate={{
                                      pattern: { value: "/[a-zA-Z]+/g" },
                                      maxLength: { value: 10 },
                                    }}
                                  /> */}
                                    <Select
                                      name="drdSortValue"
                                      options={formattedSortValues}
                                      value={selectedSortValue}
                                      onChange={handleSortChange}
                                      defaultValue={selectedSortValue}
                                    ></Select>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={4}>
                                    <label class="mt-1 mb-0">True Inches</label>
                                  </Col>
                                  <Col lg={8}>
                                    {!isAllowed ? (
                                      <AvField
                                        name="txtTrueInches"
                                        type="number"
                                        min="0"
                                        max="0.27"
                                        step="0.0001"
                                        value="0"
                                        disabled
                                      />
                                    ) : (
                                      <AvField
                                        name="txtTrueInches"
                                        type="number"
                                        min="0.0001"
                                        max="0.27"
                                        step="0.0001"
                                        value="0.0001"
                                        required
                                        validate={{
                                          required: {
                                            value: true,
                                            errorMessage:
                                              "This field is required",
                                          },
                                          min: {
                                            value: 0.0001,
                                            errorMessage:
                                              "Please enter a value between 0.0001 and 0.27",
                                          },
                                          max: {
                                            value: 0.27,
                                            errorMessage:
                                              "Please enter a value between 0.0001 and 0.27",
                                          },
                                        }}
                                      />
                                    )}
                                  </Col>
                                </Row>
                              </>
                            ) : (
                              <>
                                <Row>
                                  <Col lg={4}>
                                    <label class="mt-1 mb-0">Inches</label>
                                  </Col>
                                  <Col lg={8}>
                                    <AvField
                                      name="txtInches"
                                      value={ManageGauge.Inches}
                                      type="number"
                                      min="0.0001"
                                      max="256"
                                      step="0.0001"
                                      required
                                      onChange={handleChange}
                                      validate={{
                                        custom: validateName,
                                        required: {
                                          value: true,
                                          errorMessage:
                                            "This field is required",
                                        },
                                        min: {
                                          value: 0.0001,
                                          errorMessage:
                                            "Please enter a value between 0.0001 and 256",
                                        },
                                        max: {
                                          value: 256,
                                          errorMessage:
                                            "Please enter a value between 0.0001 and 256",
                                        },
                                      }}
                                      errorMessage={descErrorMsg}
                                    />
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={4}>
                                    <label class="mt-1 mb-0">Sort Value</label>
                                  </Col>
                                  <Col lg={8} style={{ marginBottom: 20 }}>
                                    {/* <AvField
                                    name="txtSortValue"
                                    value={ManageGauge.SortValue}
                                    required
                                    placeholder="A-Z or a-z"
                                    validate={{
                                      pattern: { value: "/[a-zA-Z]+/g" },
                                      maxLength: { value: 10 },
                                    }}
                                  /> */}
                                    <Select
                                      name="drdSortValue"
                                      options={formattedSortEditValues}
                                      value={selectedSortEditValue}
                                      onChange={handleSortEditChange}
                                      defaultValue={selectedSortEditValue}
                                    ></Select>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={4}>
                                    <label class="mt-1 mb-0">True Inches</label>
                                  </Col>
                                  <Col lg={8}>
                                    {!isAllowed ? (
                                      <AvField
                                        name="txtTrueInches"
                                        //value={ManageGauge.TrueInches.toString()}
                                        value="0"
                                        type="number"
                                        min="0"
                                        max="0.27"
                                        step="0.0001"
                                        disabled
                                      />
                                    ) : (
                                      <AvField
                                        name="txtTrueInches"
                                        value={ManageGauge.TrueInches}
                                        type="number"
                                        min="0.0001"
                                        max="0.27"
                                        step="0.0001"
                                        required
                                        validate={{
                                          required: {
                                            value: true,
                                            errorMessage:
                                              "This field is required",
                                          },
                                          min: {
                                            value: 0.0001,
                                            errorMessage:
                                              "Please enter a value between 0.0001 and 0.27",
                                          },
                                          max: {
                                            value: 0.27,
                                            errorMessage:
                                              "Please enter a value between 0.0001 and 0.27",
                                          },
                                        }}
                                      />
                                    )}
                                  </Col>
                                </Row>
                              </>
                            )}
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </ModalBody>
                <ModalFooter>
                  {!loading ? (
                    <Button form="frmInput" color="primary" key="submit">
                      Save
                    </Button>
                  ) : (
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
                  )}

                  <Button color="secondary" onClick={toggle}>
                    Cancel
                  </Button>
                  {isEdit ? (
                    !deleting ? (
                      <Button color="danger" onClick={onDelete}>
                        Delete
                      </Button>
                    ) : (
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
                    )
                  ) : (
                    <span />
                  )}
                </ModalFooter>
              </Modal>
            </AvForm>
          </div>
        </React.Fragment>
      </div>
    );
  }
}

export default ManageGaugeList;
