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
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Card,
  CardBody,
  Spinner,
} from "reactstrap";
import PageLoader from "../../../components/PageLoader";
import { Animated } from "react-animated-css";
import AddIcon from "@material-ui/icons/Add";
import VisibilityIcon from "@material-ui/icons/Visibility";
import HiddenIcon from "@material-ui/icons/VisibilityOff";
import { AvForm, AvField } from "availity-reactstrap-validation";
import swal from "sweetalert";
import Select from "react-select";
import Switch from "@material-ui/core/Switch";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import "../../../assets/css/User.css";

function UserList() {
  const frmInput = useRef(null);
  const [Users, setUsers] = useState([]);
  const [formattedUsers, setFormattedUsers] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [user, setUser] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [active, setActive] = useState(true);
  const [descErrorMsg, setDescErrorMsg] = useState("This field is required");
  const [passwordShown, setPasswordShown] = useState(false);
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

  const options = [
    { value: "Admin", label: "Admin" },
    { value: "User", label: "User" },
  ];
  const data = {
    columns: [
      {
        label: "Name",
        field: "Name",
      },
      {
        label: "User Name",
        field: "UserName",
      },
      {
        label: "Role",
        field: "Type",
      },
      {
        label: "Active",
        field: "Active",
      },
    ],
    rows: formattedUsers,
  };
  useEffect(() => {
    async function fetchUsers() {
      try {
        //const response = await axios.get("/Users");
        let apiURL = `/Users?cb=${Date.now()}`;
        console.log(apiURL);
        const response = await axios.get(apiURL);
        const arrList = response.data[0];
        var arrUserList = arrList.map((element) => ({
          id: element.UserID,
          FirstName: element.FirstName,
          LastName: element.LastName,
          Name: `${element.FirstName} ${element.LastName}`,
          UserName: element.UserName,
          Type: element.Type,
          Active: element.IsActive ? "Yes" : "No",
          clickEvent: (e) => handleClick(e, element),
        }));
        console.log(arrList);
        setUsers(arrList);
        setFormattedUsers(arrUserList);
        if (!isEdit) {
          setSelectedType(options[1]);
        }
        setPageLoading(false);
        return response;
      } catch (error) {
        console.error();
      }
    }
    fetchUsers();
  }, []);
  const handleClick = (e, data, list) => {
    console.log("event target:", e.target, "data:", data);
    setUser(data);
    setIsEdit(true);
    setActive(data.IsActive);
    let objType = options.filter((element) => element.label === data.Type);
    setSelectedType(objType[0]);
    toggle();
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
            objData.ID = user.UserID;
            objData.OldPwd = user.Password;
          }
          objData.FirstName = values.txtFirstName;
          objData.LastName = values.txtLastName;
          objData.UserName = values.txtUserName;
          objData.Pwd = values.txtPassword;
          objData.Type = selectedType.label;
          objData.IsActive = active;
          saveUser(objData);
        }
      });
    }
  };
  const saveUser = async (data) => {
    try {
      const resp = isEdit
        ? await axios.put("/User", data)
        : await axios.post("/User", data);
      console.log(resp);
      setLoading(false);
      swal({
        title: "Done!",
        text: "User saved!",
        icon: "success",
        timer: 2000,
        button: false,
      }).then(() => {
        toggle();
        window.location.reload(true);
      });
    } catch (err) {
      console.log(err);
    }
  };
  const toggle = () => setModal(!modal);
  const onDelete = () => {
    var message = "Do you want to delete this user?";
    if (user.Quotations > 0) {
      message = `There are ${user.Quotations} quotations added by this user. \n \n Do you still want to delete this user?`;
    }
    swal({
      title: "Are you sure?",
      text: message,
      icon: "warning",
      dangerMode: true,
      buttons: ["No", "Yes"],
    }).then((willDelete) => {
      if (willDelete) {
        setDeleting(true);
        let objData = {};
        objData.ID = user.UserID;
        deleteUser(objData);
      }
    });
  };
  const deleteUser = async (data) => {
    try {
      const resp = await axios.delete(`/User/${data.ID}`);
      console.log(resp);
      setDeleting(false);
      swal({
        title: "Done!",
        text: "User deleted!",
        icon: "success",
        timer: 2000,
        button: false,
      }).then(() => {
        toggle();
        window.location.reload(true);
      });
    } catch (err) {
      console.log(err);
    }
  };
  const handleActive = (event) => {
    setActive(event.target.checked);
  };
  const handleChange = (newValue, actionMeta) => {
    setSelectedType(newValue);
  };

  const validateName = (value, ctx, input, cb) => {
    let duplicate = formattedUsers.filter(
      (element) => element.UserName.toLowerCase() == value.toLowerCase()
    );
    if (duplicate.length > 0) {
      console.log(duplicate.length);
      setDescErrorMsg("This user name already exists.");
      cb(false);
    } else {
      console.log(duplicate.length);
      setDescErrorMsg("This field is invalid.");
      cb(true);
    }
    return;
  };
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  const divStyle = {
    position: "absolute",
    left: "50%",
    top: "50%",
    zIndex: 9999,
  };
  const userModal = {
    width: 600,
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
                  <h4 className="page-title">Manage Users</h4>
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
                  <ModalHeader toggle={toggle}>Add User</ModalHeader>
                ) : (
                  <ModalHeader toggle={toggle}>Edit User</ModalHeader>
                )}
                <ModalBody>
                  <div>
                    <Row>
                      <Col lg={12}>
                        <Card>
                          <CardBody>
                            {!isEdit ? (
                              <div>
                                <Row>
                                  <Col lg={5}>
                                    <label>First Name</label>
                                  </Col>
                                  <Col lg={7}>
                                    <AvField
                                      name="txtFirstName"
                                      maxlength="50"
                                      required
                                      validate={{
                                        required: {
                                          value: true,
                                          errorMessage:
                                            "This field is required",
                                        },
                                      }}
                                    />
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={5}>
                                    <label>Last Name</label>
                                  </Col>
                                  <Col lg={7}>
                                    <AvField
                                      name="txtLastName"
                                      maxlength="50"
                                      required
                                      validate={{
                                        required: {
                                          value: true,
                                          errorMessage:
                                            "This field is required",
                                        },
                                      }}
                                    />
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={5}>
                                    <label>User Name</label>
                                  </Col>
                                  <Col lg={7}>
                                    <AvField
                                      name="txtUserName"
                                      type="email"
                                      maxlength="150"
                                      required
                                      validate={{
                                        custom: validateName,
                                        required: {
                                          value: true,
                                          errorMessage:
                                            "This field is required",
                                        },
                                      }}
                                      errorMessage={descErrorMsg}
                                    />
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={5}>
                                    <label>Password</label>
                                  </Col>
                                  <Col lg={7} className="PasswordInput">
                                    <InputGroup>
                                      <AvField
                                        name="txtPassword"
                                        //type="password"
                                        type={
                                          passwordShown ? "text" : "password"
                                        }
                                        maxlength="150"
                                        required
                                        validate={{
                                          required: {
                                            value: true,
                                            errorMessage:
                                              "This field is required",
                                          },
                                        }}
                                      />
                                      <InputGroupAddon addonType="append">
                                        <InputGroupText
                                          onClick={togglePasswordVisiblity}
                                        >
                                          {!passwordShown ? (
                                            <VisibilityIcon />
                                          ) : (
                                            <HiddenIcon />
                                          )}
                                        </InputGroupText>
                                      </InputGroupAddon>
                                    </InputGroup>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={5}>
                                    <label>Type</label>
                                  </Col>
                                  <Col lg={7} style={{ marginBottom: 20 }}>
                                    <Select
                                      className="drdType"
                                      options={options}
                                      value={selectedType}
                                      onChange={handleChange}
                                    ></Select>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={5}>
                                    <label>Active</label>
                                  </Col>
                                  <Col lg={7}>
                                    <MuiThemeProvider theme={theme}>
                                      <Switch
                                        name="chkActive"
                                        color="primary"
                                        onChange={handleActive}
                                        checked={active}
                                      />
                                    </MuiThemeProvider>
                                  </Col>
                                </Row>
                              </div>
                            ) : (
                              <div>
                                <Row>
                                  <Col lg={5}>
                                    <label>First Name</label>
                                  </Col>
                                  <Col lg={7}>
                                    <AvField
                                      name="txtFirstName"
                                      value={user.FirstName}
                                      maxlength="50"
                                      required
                                      validate={{
                                        required: {
                                          value: true,
                                          errorMessage:
                                            "This field is required",
                                        },
                                      }}
                                    />
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={5}>
                                    <label>Last Name</label>
                                  </Col>
                                  <Col lg={7}>
                                    <AvField
                                      name="txtLastName"
                                      value={user.LastName}
                                      maxlength="50"
                                      required
                                      validate={{
                                        required: {
                                          value: true,
                                          errorMessage:
                                            "This field is required",
                                        },
                                      }}
                                    />
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={5}>
                                    <label>User Name</label>
                                  </Col>
                                  <Col lg={7}>
                                    <AvField
                                      name="txtUserName"
                                      value={user.UserName}
                                      type="email"
                                      maxlength="150"
                                      required
                                      disabled="true"
                                      /*  validate={{
                                        custom: validateName,
                                      }} */
                                      errorMessage={descErrorMsg}
                                    />
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={5}>
                                    <label>Password</label>
                                  </Col>
                                  <Col lg={7}>
                                    <AvField
                                      name="txtPassword"
                                      value={user.Password}
                                      maxlength="150"
                                      type="password"
                                      required
                                      validate={{
                                        required: {
                                          value: true,
                                          errorMessage:
                                            "This field is required",
                                        },
                                      }}
                                    />
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={5}>
                                    <label>Type</label>
                                  </Col>
                                  <Col lg={7} style={{ marginBottom: 20 }}>
                                    <Select
                                      className="drdType"
                                      options={options}
                                      value={selectedType}
                                      onChange={handleChange}
                                    ></Select>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={5}>
                                    <label>Active</label>
                                  </Col>
                                  <Col lg={7}>
                                    <MuiThemeProvider theme={theme}>
                                      <Switch
                                        checked={active}
                                        name="chkActive"
                                        color="primary"
                                        onChange={handleActive}
                                      />
                                    </MuiThemeProvider>
                                  </Col>
                                </Row>
                              </div>
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

export default UserList;
