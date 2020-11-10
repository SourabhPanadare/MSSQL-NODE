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

function SkidTypeList() {
  const [skidTypes, setSkidTypes] = useState([]);
  const [formattedSkidTypes, setFormattedSkidTypes] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const history = useHistory();
  const data = {
    columns: [
      {
        label: "Description",
        field: "Desc",
      },
      {
        label: "Width",
        field: "Width",
      },
      {
        label: "Length",
        field: "Length",
      },
      {
        label: "Sort Code",
        field: "SortCode",
      },
      {
        label: "Skid Cost",
        field: "SkidCost",
      },
      {
        label: "Wrap Cost",
        field: "WrapCost",
      },
    ],
    rows: formattedSkidTypes,
  };
  useEffect(() => {
    async function fetchSkidTypes() {
      try {
        let apiURL = `/SkidTypes?cb=${Date.now()}`;
        const response = await axios.get(apiURL);
        const arrList = response.data[0];
        var arrFormattedList = arrList.map((element) => ({
          id: element.SkidTypeID,
          Desc: element.Description,
          Width: element.Width,
          Length: element.Length,
          SortCode: element.SortCode,
          SkidCost: `$ ${parseFloat(element.SkidCost).toFixed(2)}`,
          WrapCost: `$ ${parseFloat(element.WrapCost).toFixed(2)}`,
          clickEvent: (e) => handleClick(e, element, arrList),
        }));
        setSkidTypes(response.data[0]);
        setFormattedSkidTypes(arrFormattedList);

        setPageLoading(false);
        return response;
      } catch (error) {
        console.error();
      }
    }
    fetchSkidTypes();
  }, []);
  const handleClick = (e, data, list) => {
    console.log("event target:", e.target, "data:", data, list);
    history.push(`/SkidTypes/${data.SkidTypeID}`, list);
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
                  <h4 className="page-title">Manage Skid Types</h4>
                  <Button
                    lg={3}
                    color="primary"
                    className="quotation__button"
                    onClick={() => history.push("/SkidType/Add", skidTypes)}
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

export default SkidTypeList;
