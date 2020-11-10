import React, { useState, useEffect } from "react";
import { Map } from "react-loadable";
import axios from "./axios";
import { Row, Col, Card, CardBody, Label, FormGroup, Button } from "reactstrap";
import Loader from "./components/Loader";
import { getLoggedInUser } from "./helpers/authUtils";
import { AvForm, AvField } from "availity-reactstrap-validation";
import CreatableSelect from "react-select/creatable";
import Quotation from "./pages/Quotation";

function TestApi() {
  const [masters, setMasters] = useState([]);
  useEffect(() => {
    async function fetchMasters() {
      const response = await axios.get("/Masters");
      setMasters(response.data);
      setCustomers(response.data[0]);
      setProductionLines(response.data[1]);
      return response;
    }
    fetchMasters();
  }, []);

  const [customers, setCustomers] = useState([]);
  const [productionLines, setProductionLines] = useState([]);

  console.log(masters);

  const createOption = (label) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
  });

  const defaultOptions = [
    createOption("One"),
    createOption("Two"),
    createOption("Three"),
  ];
  const handleCreate = (inputValue) => {
    this.setState({ isLoading: true });
    console.group("Option created");
    console.log("Wait a moment...");
    setTimeout(() => {
      const { options } = this.state;
      const newOption = createOption(inputValue);
      console.log(newOption);
      console.groupEnd();
      this.setState({
        isLoading: false,
        options: [...options, newOption],
        value: newOption,
      });
    }, 1000);
  };
  /*  return {
    <div>
      <h1>Test API call</h1>
      <select>
        {customers.map(({ CustomerID, CustomerName }) => (
          <option value={CustomerID}>{CustomerName}</option>
        ))}
      </select>
      <select>
        {productionLines.map(({ ProductionLineID, Code }) => (
          <option value={ProductionLineID}>{Code}</option>
        ))}
      </select>
    </div>
    
  }; */

  return (
    <React.Fragment>
      <div className="">
        {/* preloader */}

        <Row>
          <Col lg={12}>
            <div className="page-title-box">
              {/* <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <a href="/">Adminto</a>
                    </li>
                    <li className="breadcrumb-item active">Dashboard</li>
                  </ol>
                </div> */}
              <Quotation />
              <h4 className="page-title">New Quote</h4>
            </div>
          </Col>
        </Row>

        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <AvForm>
                  <Row>
                    <Col lg={3} />
                    <Col lg={2}>
                      <label>Customer</label>
                    </Col>
                    <Col lg={2}>
                      <CreatableSelect
                        isClearable
                        onCreateOption={handleCreate}
                        options={defaultOptions}
                      />
                    </Col>
                    <Col lg={3} />
                  </Row>

                  <Row>
                    <Col lg={5} />
                    <Col lg={2}>
                      <Button color="primary" className="btn-block">
                        Compute Estimate
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
  );
}

export default TestApi;
