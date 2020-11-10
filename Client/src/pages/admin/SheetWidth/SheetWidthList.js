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
function SheetWidthList() {
  const frmInput = useRef(null);
  const [SheetWidths, setSheetWidths] = useState([]);
  const [SheetWidth, setSheetWidth] = useState([]);
  const [formattedSheetWidth, setFormattedSheetWidth] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [descErrorMsg, setDescErrorMsg] = useState("This field is required");
  const data = {
    columns: [
      {
        label: "Sheet Width",
        field: "SheetWidth",
      },
    ],
    rows: formattedSheetWidth,
  };
  useEffect(() => {
    async function fetchSheetWidth() {
      try {
        let apiURL = `/SheetWidth?cb=${Date.now()}`;
        const response = await axios.get(apiURL);
        const arrList = response.data;
        var arrFormattedList = arrList.map((element) => ({
          id: element.SheetWidthID,
          SheetWidth: element.SheetWidth,
          clickEvent: (e) => handleClick(e, element),
        }));
        setSheetWidths(response.data);
        setFormattedSheetWidth(arrFormattedList);

        setPageLoading(false);
        return response;
      } catch (error) {
        console.error();
      }
    }
    fetchSheetWidth();
  }, []);
  const handleClick = (e, data, list) => {
    console.log("event target:", e.target, "data:", data);
    setSheetWidth(data);
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
            objData.ID = SheetWidth.SheetWidthID;
          }
          objData.SheetWidth = values.txtSheetWidth;
          saveSheetWidth(objData);
        }
      });
    }
  };
  const saveSheetWidth = async (data) => {
    try {
      const resp = isEdit
        ? await axios.put("/SheetWidth", data)
        : await axios.post("/SheetWidth", data);
      console.log(resp);
      setLoading(false);
      swal({
        title: "Done!",
        text: "Sheet Width saved!",
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
        objData.ID = SheetWidth.SheetWidthID;
        deleteSheetWidth(objData);
      }
    });
  };
  const deleteSheetWidth = async (data) => {
    try {
      const resp = await axios.delete(`/SheetWidth/${data.ID}`);
      console.log(resp);
      setDeleting(false);
      swal({
        title: "Done!",
        text: "Sheet width deleted!",
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
    let duplicateCode = [];
    if (!isEdit) {
      duplicateCode = SheetWidths.filter(
        (element) => element.SheetWidth == value
      );
    } else {
      if (parseInt(value) != parseInt(SheetWidth.SheetWidth)) {
        duplicateCode = SheetWidths.filter(
          (element) => element.SheetWidth == value
        );
      }
    }
    console.log(duplicateCode);
    console.log(duplicateCode.length);
    if (duplicateCode.length > 0) {
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
                  <h4 className="page-title">Manage Sheet Width</h4>
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
                  <ModalHeader toggle={toggle}>Add Sheet Width</ModalHeader>
                ) : (
                  <ModalHeader toggle={toggle}>Edit Sheet Width</ModalHeader>
                )}
                <ModalBody>
                  <div>
                    <Col lg={12}>
                      <Row>
                        <Col lg={12}>
                          <Card>
                            <CardBody>
                              {!isEdit ? (
                                <Row>
                                  <Col lg={4} xl={4}>
                                    <label>Sheet Width</label>
                                  </Col>
                                  <Col lg={6} xl={6}>
                                    <AvField
                                      name="txtSheetWidth"
                                      type="number"
                                      min="12"
                                      max="73"
                                      required
                                      validate={{
                                        custom: validateName,
                                        required: {
                                          value: true,
                                          errorMessage:
                                            "This field is required",
                                        },
                                        min: {
                                          value: 12,
                                          errorMessage:
                                            "Please enter a value between 12 and 73",
                                        },
                                        max: {
                                          value: 73,
                                          errorMessage:
                                            "Please enter a value between 12 and 73",
                                        },
                                      }}
                                      errorMessage={descErrorMsg}
                                    />
                                  </Col>
                                </Row>
                              ) : (
                                <Row>
                                  <Col lg={4}>
                                    <label>Sheet Width</label>
                                  </Col>
                                  <Col lg={6}>
                                    <AvField
                                      name="txtSheetWidth"
                                      value={SheetWidth.SheetWidth}
                                      type="number"
                                      min="12"
                                      max="73"
                                      required
                                      validate={{
                                        custom: validateName,
                                        required: {
                                          value: true,
                                          errorMessage:
                                            "This field is required",
                                        },
                                        min: {
                                          value: 12,
                                          errorMessage:
                                            "Please enter a value between 12 and 73",
                                        },
                                        max: {
                                          value: 73,
                                          errorMessage:
                                            "Please enter a value between 12 and 73",
                                        },
                                      }}
                                      errorMessage={descErrorMsg}
                                    />
                                  </Col>
                                </Row>
                              )}
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                    </Col>
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

export default SheetWidthList;
