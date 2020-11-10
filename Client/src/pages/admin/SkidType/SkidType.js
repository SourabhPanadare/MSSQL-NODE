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
function SkidType(props) {
  const frmInput = useRef(null);
  const history = useHistory();
  const [skidType, setSkidType] = useState({});
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [sortValues, setSortValues] = useState([]);
  const [formattedSortValues, setFormattedSortValues] = useState([]);
  const [selectedSortValue, setSelectedSortValue] = useState(null);
  const [skidTypes, setSkidTypes] = useState(history.location.state);
  const [descErrorMsg, setDescErrorMsg] = useState("This field is required");
  useEffect(() => {
    async function fetchSkidType() {
      try {
        const response = await axios.get(
          `/SkidType/${parseInt(props.match.params.id)}?cb=${Date.now()}`
        );
        setSkidType(response.data[0][0]);
        setSortValues(response.data[1]);

        generateSortValueArray(
          response.data[1],
          response.data[0][0].SortCode.trim()
        );
        setPageLoading(false);
        return response;
      } catch (error) {
        console.error();
      }
    }
    fetchSkidType();
  }, []);

  const generateSortValueArray = (results, match) => {
    var arrFormattedSortValues = results.map((element) => ({
      value: element.SortValueID,
      label: element.SortValue,
    }));
    setFormattedSortValues(arrFormattedSortValues);

    let objFound = arrFormattedSortValues.filter(
      (element) => element.label.trim() === match
    );

    setSelectedSortValue(objFound[0]);
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
          objData.ID = parseInt(skidType.SkidTypeID);
          objData.Desc = values.txtDesc;
          let arrDesc = values.txtDesc.toLowerCase().split("x");
          if (arrDesc.length > 0) {
            objData.Width = parseInt(arrDesc[0].trim());
            objData.Length = parseInt(arrDesc[1].trim());
          }
          /* objData.Width = values.txtWidth;
          objData.Length = values.txtLength; */
          objData.SkidCost = values.txtSkidCost;
          objData.WrapCost = values.txtWrapCost;
          //objData.SortCode = values.txtSortCode.trim();
          objData.SortCode = selectedSortValue.label.trim();
          saveSkidType(objData);
        }
      });
    }
  };
  const saveSkidType = async (data) => {
    try {
      const resp = await axios.put("/SkidType", data);
      console.log(resp);
      setLoading(false);
      swal({
        title: "Done!",
        text: "Skid Type saved!",
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
        objData.id = parseInt(skidType.SkidTypeID);
        deleteSkidType(objData);
      }
    });
  };
  const deleteSkidType = async (data) => {
    try {
      const resp = await axios.delete(`/SkidType/${data.id}`);
      console.log(resp);
      setDeleting(false);
      swal({
        title: "Done!",
        text: "SkidType deleted!",
        icon: "success",
        timer: 2000,
        button: false,
      }).then(() => {
        //window.location.reload();
        //history.goBack();
        history.push("/SkidType/List");
      });
    } catch (err) {
      console.log(err);
    }
  };
  const resetForm = () => {
    window.location.reload();
  };

  const handleChange = (newValue, actionMeta) => {
    setSelectedSortValue(newValue);
  };
  const validateName = (value, ctx, input, cb) => {
    let duplicateSkidType = [];
    if (value.trim().toLowerCase != skidType.Description.trim().toLowerCase) {
      duplicateSkidType = skidTypes.filter(
        (element) => element.Description.toLowerCase() == value.toLowerCase()
      );
    }
    if (duplicateSkidType.length > 0) {
      setDescErrorMsg("This field should be unique.");
      cb(false);
    } else {
      setDescErrorMsg(
        "This field is invalid. Accepted value is 'width x length'"
      );
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
                <h4 className="page-title">Edit Skid Type</h4>
                <Button
                  color="primary"
                  className="quotation__button"
                  onClick={() => history.push("/SkidType/List")}
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
                        <label>Description</label>
                      </Col>
                      <Col lg={2}>
                        <AvField
                          name="txtDesc"
                          value={skidType.Description}
                          maxlength="50"
                          required
                          validate={{
                            pattern: { value: "/([0-9]+ [Xx] [0-9]+)/" },
                            custom: validateName,
                            required: {
                              value: true,
                              errorMessage: "This field is required",
                            },
                          }}
                          errorMessage={descErrorMsg}
                        />
                      </Col>
                      <Col lg={2} />
                    </Row>
                    {/* <Row>
                      <Col lg={3} />
                      <Col lg={2}>
                        <label>Width</label>
                      </Col>
                      <Col lg={1}>
                        <AvField
                          name="txtWidth"
                          value={skidType.Width}
                          max="600"
                          type="number"
                          required
                        />
                      </Col>
                      <Col lg={2} />
                    </Row>
                    <Row>
                      <Col lg={3} />
                      <Col lg={2}>
                        <label>Length</label>
                      </Col>
                      <Col lg={1}>
                        <AvField
                          name="txtLength"
                          value={skidType.Length}
                          max="600"
                          type="number"
                          required
                        />
                      </Col>
                      <Col lg={2} />
                    </Row> */}
                    <Row>
                      <Col lg={3} />
                      <Col lg={2}>
                        <label>Skid Cost</label>
                      </Col>
                      <Col lg={1}>
                        <AvField
                          name="txtSkidCost"
                          value={skidType.SkidCost}
                          max="600"
                          type="number"
                          required
                          validate={{
                            required: {
                              value: true,
                              errorMessage: "This field is required",
                            },
                            min: {
                              value: 1,
                              errorMessage:
                                "Please enter a value between 1 and 500",
                            },
                            max: {
                              value: 500,
                              errorMessage:
                                "Please enter a value between 1 and 500",
                            },
                          }}
                        />
                      </Col>
                      <Col lg={2} />
                    </Row>
                    <Row>
                      <Col lg={3} />
                      <Col lg={2}>
                        <label>Wrap Cost</label>
                      </Col>
                      <Col lg={1}>
                        <AvField
                          name="txtWrapCost"
                          value={skidType.WrapCost}
                          max="600"
                          type="number"
                          required
                          validate={{
                            required: {
                              value: true,
                              errorMessage: "This field is required",
                            },
                            min: {
                              value: 1,
                              errorMessage:
                                "Please enter a value between 1 and 500",
                            },
                            max: {
                              value: 500,
                              errorMessage:
                                "Please enter a value between 1 and 500",
                            },
                          }}
                        />
                      </Col>
                      <Col lg={2} />
                    </Row>
                    <Row>
                      <Col lg={3} />
                      <Col lg={2}>
                        <label>Sort Code</label>
                      </Col>
                      <Col lg={1} style={{ marginBottom: 20 }}>
                        {/*  <AvField
                          name="txtSortCode"
                          value={skidType.SortCode}
                          maxlength="10"
                          required
                        /> */}
                        <Select
                          name="drdSortValue"
                          options={formattedSortValues}
                          value={selectedSortValue}
                          onChange={handleChange}
                          defaultValue={selectedSortValue}
                        ></Select>
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

export default SkidType;
