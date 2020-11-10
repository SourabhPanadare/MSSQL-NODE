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
import { useHistory } from "react-router-dom";

function PLParameterList() {
  const [PLParameter, setPLParameter] = useState([]);
  const [formattedPLParameter, setFormattedPLParameter] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const history = useHistory();
  const data = {
    columns: [
      {
        label: "Code",
        field: "Code",
      },
      {
        label: "Coeffecient",
        field: "Coeffecient",
      },
      {
        label: "Length",
        field: "Length",
      },
      {
        label: "Thickness",
        field: "Thickness",
      },
      {
        label: "Width",
        field: "Width",
      },
      {
        label: "Setup Length",
        field: "SetupLength",
      },
      {
        label: "Setup Thickness",
        field: "SetupThickness",
      },
      {
        label: "Coil Setup",
        field: "CoilSetup",
      },
      {
        label: "Skid Time Change",
        field: "SkidTimeChange",
      },
      {
        label: "Pull Coil",
        field: "PullCoil",
      },
      {
        label: "Line Max SkidWidth",
        field: "LineMaxSkidWidth",
      },
      {
        label: "Cost Per Line",
        field: "CostPerLine",
      },
    ],
    rows: formattedPLParameter,
  };
  useEffect(() => {
    async function fetchPLParameter() {
      try {
        let apiURL = `/PLParameters?cb=${Date.now()}`;
        const response = await axios.get(apiURL);
        const arrList = response.data[0];
        var arrFormattedList = arrList.map((element) => ({
          Code: element.Code,
          Coeffecient: element.Coeffecient,
          Length: element.Length,
          Thickness: element.Thickness,
          Width: element.Width,
          SetupLength: element.SetupLength,
          SetupThickness: element.SetupThickness,
          CoilSetup: element.CoilSetup,
          SkidTimeChange: element.SkidTimeChange,
          PullCoil: element.PullCoil,
          LineMaxSkidWidth: element.LineMaxSkidWidth,
          CostPerLine: element.CostPerLine,
          clickEvent: (e) => handleClick(e, element, arrList),
        }));
        setPLParameter(response.data[0]);
        setFormattedPLParameter(arrFormattedList);

        setPageLoading(false);
        return response;
      } catch (error) {
        console.error();
      }
    }
    fetchPLParameter();
  }, []);
  const handleClick = (e, data, list) => {
    console.log("event target:", e.target, "data:", data, list);
    history.push(`/PLParameters/${data.PLPID}`);
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
                  <h4 className="page-title">Production Line Parameters</h4>
                  <Button
                    lg={3}
                    color="primary"
                    className="quotation__button"
                    onClick={() =>
                      history.push("/PLParameter/Add", PLParameter)
                    }
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
          </div>
        </React.Fragment>
      </div>
    );
  }
}

export default PLParameterList;
