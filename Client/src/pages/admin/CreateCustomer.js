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
import axios from "../../axios";
import PageLoader from "../../components/PageLoader";
import swal from "sweetalert";
import Select from "react-select";
import "../../assets/css/Customer.css";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import Switch from "@material-ui/core/Switch";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";

function CreateCustomer() {
  const [loading, setLoading] = useState(false);
  const [formattedStates, setFormattedStates] = useState([]);
  const [formattedUsers, setFormattedUsers] = useState([]);
  const [selectedState, setSelectedState] = useState();
  const [active, setActive] = useState(true);
  const [selectedUser, setSelectedUser] = useState();
  const [pageLoading, setPageLoading] = useState(true);
  const frmInput = useRef(null);
  const history = useHistory();

  useEffect(() => {
    async function fetchMasters() {
      try {
        const response = await axios.get("/Admin/Masters");
        generateStateArray(response.data[0]);
        generateUserArray(response.data[1]);
        setPageLoading(false);
        return response;
      } catch (error) {
        console.log(error);
      }
    }
    fetchMasters();
  }, []);

  const generateStateArray = (results) => {
    var arrformattedStates = results.map((element) => ({
      value: element.StateID,
      label: element.Code,
    }));
    setFormattedStates(arrformattedStates);
  };
  const generateUserArray = (results) => {
    var arrFormattedUsers = results.map((element) => ({
      value: element.UserID,
      label: `${element.FirstName} ${element.LastName}`,
    }));
    setFormattedUsers(arrFormattedUsers);
  };
  const handleChange = (newValue, actionMeta) => {
    switch (actionMeta.name) {
      case "drdStates":
        setSelectedState(newValue);
        break;
      case "drdUsers":
        setSelectedUser(newValue);
        break;
    }
  };
  const handleActive = (event) => {
    setActive(event.target.checked);
  };
  const handleSubmit = (event, errors, values) => {
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
          let objCustomer = {};
          objCustomer.Name = values.txtName;
          objCustomer.Address1 = values.txtAdd1;
          objCustomer.Address2 = values.txtAdd2;
          objCustomer.City = values.txtCity;
          objCustomer.State = selectedState.label;
          objCustomer.User = selectedUser.value;
          objCustomer.Zip = values.txtZip;
          objCustomer.Active = active;
          saveCustomer(objCustomer);
        }
      });
    }
  };
  const saveCustomer = async (data) => {
    try {
      const resp = await axios.post("/Customer", data);
      console.log(resp);
      setLoading(false);
      swal({
        title: "Done!",
        text: "Customer saved!",
        icon: "success",
        timer: 2000,
        button: false,
      }).then(() => {
        //window.location.reload();
        history.push("/Customers");
      });
    } catch (err) {
      console.log(err);
    }
  };
  const resetForm = () => {
    frmInput.current.reset();
    setSelectedUser(null);
    setSelectedState(null);
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
          <div className="">
            <Row>
              <Col lg={12}>
                <div className="flex-container">
                  <h4 className="page-title">Add Customer</h4>
                  <Button
                    color="primary"
                    className="quotation__button"
                    onClick={() => history.push("/Customers")}
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
                          <label>Name</label>
                        </Col>
                        <Col lg={3}>
                          <AvField 
                            name="txtName" 
                            maxlength="150" 
                            required 
                            validate={{
                              required: {
                                value: true,
                                errorMessage: "This field is required",
                              }
                            }}
                          />
                        </Col>
                        <Col lg={2} />
                      </Row>
                      <Row>
                        <Col lg={3} />
                        <Col lg={2}>
                          <label>Assign To</label>
                        </Col>
                        <Col lg={3} style={{ marginBottom: 20 }}>
                          <Select
                            id="drdUsers"
                            name="drdUsers"
                            required
                            options={formattedUsers}
                            onChange={handleChange}
                            value={selectedUser}
                          />
                        </Col>
                        <Col lg={2} />
                      </Row>
                      <Row>
                        <Col lg={3} />
                        <Col lg={2}>
                          <label>Address 1</label>
                        </Col>
                        <Col lg={3}>
                          <AvField
                            name="txtAdd1"
                            type="textarea"
                            rows="3"
                            maxlength="150"
                            required
                            validate={{
                              required: {
                                value: true,
                                errorMessage: "This field is required",
                              }
                            }}
                          />
                        </Col>
                        <Col lg={2} />
                      </Row>
                      <Row>
                        <Col lg={3} />
                        <Col lg={2}>
                          <label>Address 2</label>
                        </Col>
                        <Col lg={3}>
                          <AvField 
                            name="txtAdd2" 
                            type="textarea" 
                            rows="3" 
                            maxlength="150" 
                          />
                        </Col>
                        <Col lg={2} />
                      </Row>
                      <Row>
                        <Col lg={3} />
                        <Col lg={2}>
                          <label>City</label>
                        </Col>
                        <Col lg={3}>
                          <AvField 
                            name="txtCity" 
                            maxlength="50" 
                            required 
                            validate={{
                              required: {
                                value: true,
                                errorMessage: "This field is required",
                              }
                            }}
                          />
                        </Col>
                        <Col lg={2} />
                      </Row>
                      <Row>
                        <Col lg={3} />
                        <Col lg={2}>
                          <label>State</label>
                        </Col>
                        <Col lg={3} style={{ marginBottom: 20 }}>
                          <Select
                            id="drdStates"
                            name="drdStates"
                            required
                            options={formattedStates}
                            onChange={handleChange}
                            value={selectedState}
                          />
                        </Col>
                        <Col lg={2} />
                      </Row>

                      <Row>
                        <Col lg={3} />
                        <Col lg={2}>
                          <label>Zip</label>
                        </Col>
                        <Col lg={3}>
                          <AvField 
                            name="txtZip" 
                            maxlength="20" 
                            required 
                            validate={{
                              required: {
                                value: true,
                                errorMessage: "This field is required",
                              }
                            }}
                          />
                        </Col>
                        <Col lg={2} />
                      </Row>
                      <Row>
                        <Col lg={3} />
                        <Col lg={2}>
                          <label>Active</label>
                        </Col>
                        <Col lg={3}>
                          <MuiThemeProvider theme={theme}>
                            <Switch
                              checked={active}
                              name="chkActive"
                              color="primary"
                              onChange={handleActive}
                            />
                          </MuiThemeProvider>
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
          </div>
        </React.Fragment>
      </Animated>
    );
  }
}

export default CreateCustomer;
