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
function SheetLengthList() {
  const frmInput = useRef(null);
  const [SheetLengths, setSheetLengths] = useState([]);
  const [SheetLength, setSheetLength] = useState([]);
  const [formattedSheetLength, setFormattedSheetLength] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [descErrorMsg, setDescErrorMsg] = useState("This field is required");
  const data = {
    columns: [
      {
        label: "Sheet Length",
        field: "SheetLength",
      },
    ],
    rows: formattedSheetLength,
  };
  useEffect(() => {
    async function fetchSheetLength() {
      try {
        let apiURL = `/SheetLength?cb=${Date.now()}`;
        const response = await axios.get(apiURL);
        const arrList = response.data;
        var arrFormattedList = arrList.map((element) => ({
          id: element.SheetLengthID,
          SheetLength: element.SheetLength,
          clickEvent: (e) => handleClick(e, element),
        }));
        setSheetLengths(response.data);
        setFormattedSheetLength(arrFormattedList);

        setPageLoading(false);
        return response;
      } catch (error) {
        console.error();
      }
    }
    fetchSheetLength();
  }, []);
  const handleClick = (e, data, list) => {
    //console.log("event target:", e.target, "data:", data);
    setSheetLength(data);
    setIsEdit(true);
    toggle();
    //history.push(`/Customer/${data}`);

    //history.push("/Customer");
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
            objData.ID = SheetLength.SheetLengthID;
          }
          objData.SheetLength = values.txtSheetLength;
          saveSheetLength(objData);
        }
      });
    }
  };
  const saveSheetLength = async (data) => {
    try {
      const resp = isEdit
        ? await axios.put("/SheetLength", data)
        : await axios.post("/SheetLength", data);
      console.log(resp);
      setLoading(false);
      swal({
        title: "Done!",
        text: "Sheet Length saved!",
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
        objData.ID = SheetLength.SheetLengthID;
        deleteSheetLength(objData);
      }
    });
  };
  const deleteSheetLength = async (data) => {
    try {
      const resp = await axios.delete(`/SheetLength/${data.ID}`);
      console.log(resp);
      setDeleting(false);
      swal({
        title: "Done!",
        text: "Sheet Length deleted!",
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
    let duplicateLength = [];
    if (!isEdit) {
      duplicateLength = SheetLengths.filter(
        (element) => element.SheetLength == value
      );
    } else {
      if (parseInt(value) != parseInt(SheetLength.SheetLength)) {
        duplicateLength = SheetLengths.filter(
          (element) => element.SheetLength == value
        );
      }
    }
    if (duplicateLength.length > 0) {
      setDescErrorMsg("This field should be unique.");
      cb(false);
    } else {
      //setDescErrorMsg("This field is invalid.");
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
                  <h4 className="page-title">Manage Sheet Length</h4>
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
                  <ModalHeader toggle={toggle}>Add Sheet Length</ModalHeader>
                ) : (
                  <ModalHeader toggle={toggle}>Edit Sheet Length</ModalHeader>
                )}
                <ModalBody>
                  <div>
                    <Row>
                      <Card className="w-100">
                        <CardBody>
                          {!isEdit ? (
                            <Row>
                              <Col lg={4}>
                                <label className="mt-1 mb-0">
                                  Sheet Length
                                </label>
                              </Col>
                              <Col lg={8}>
                                <AvField
                                  name="txtSheetLength"
                                  type="number"
                                  min="12"
                                  max="250"
                                  required
                                  validate={{
                                    custom: validateName,
                                    required: {
                                      value: true,
                                      errorMessage: "This field is required",
                                    },
                                    min: {
                                      value: 12,
                                      errorMessage:
                                        "Please enter a value between 12 and 250",
                                    },
                                    max: {
                                      value: 250,
                                      errorMessage:
                                        "Please enter a value between 1 and 250",
                                    },
                                  }}
                                  errorMessage={descErrorMsg}
                                />
                              </Col>
                            </Row>
                          ) : (
                            <Row>
                              <Col lg={4}>
                                <label className="mt-1 mb-0">
                                  Sheet Length
                                </label>
                              </Col>
                              <Col lg={8}>
                                <AvField
                                  name="txtSheetLength"
                                  value={SheetLength.SheetLength}
                                  type="number"
                                  min="12"
                                  max="250"
                                  required
                                  validate={{
                                    custom: validateName,
                                    required: {
                                      value: true,
                                      errorMessage: "This field is required",
                                    },
                                    min: {
                                      value: 12,
                                      errorMessage:
                                        "Please enter a value between 12 and 250",
                                    },
                                    max: {
                                      value: 250,
                                      errorMessage:
                                        "Please enter a value between 12 and 250",
                                    },
                                  }}
                                  errorMessage={descErrorMsg}
                                />
                              </Col>
                            </Row>
                          )}
                        </CardBody>
                      </Card>
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

export default SheetLengthList;
