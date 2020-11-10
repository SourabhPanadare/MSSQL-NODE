import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Row, Col, Card, CardBody, Label, FormGroup, Button } from "reactstrap";

import { getLoggedInUser } from "../helpers/authUtils";
import Loader from "../components/Loader";
import {
  AvForm,
  AvField,
  AvGroup,
  AvInput,
  AvFeedback,
  AvCheckbox,
  AvCheckboxGroup,
} from "availity-reactstrap-validation";
import TestApi from "../TestApi";
import axios from "../axios";

class DefaultDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: getLoggedInUser(),
    };
  }

  render() {
    return (
      <React.Fragment>
        <div className="">
          {/* preloader */}
          {this.props.loading && <Loader />}

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
                <h4 className="page-title">New Quote</h4>
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <AvForm onValidSubmit={this.handleValidSubmit}>
                    <Row>
                      <Col lg={3} />
                      <Col lg={2}>
                        <label>Customer</label>
                      </Col>
                      <Col lg={2}>
                        <AvField
                          name="username"
                          placeholder="Enter your username"
                          value={this.state.username}
                          required
                          autocomplete="off"
                        />
                      </Col>
                      <Col lg={3} />
                    </Row>
                    <Row>
                      <Col lg={3} />
                      <Col lg={2}>
                        <label>Requested Delivery Date</label>
                      </Col>
                      <Col lg={2}>
                        <AvField
                          name="username"
                          placeholder="Enter your username"
                          type="date"
                          value={this.state.username}
                          required
                        />
                      </Col>
                      <Col lg={3} />
                    </Row>
                    <Row>
                      <Col lg={3} />
                      <Col lg={2}>
                        <label>Production Line</label>
                      </Col>
                      <Col lg={2}>
                        <AvField
                          name="username"
                          placeholder="Enter your username"
                          value={this.state.username}
                          required
                        />
                      </Col>
                      <Col lg={3} />
                    </Row>
                    <Row>
                      <Col lg={3} />
                      <Col lg={2}>
                        <label>Gauge</label>
                      </Col>
                      <Col lg={2}>
                        <AvField
                          name="username"
                          placeholder="Enter your username"
                          value={this.state.username}
                          required
                        />
                      </Col>
                      <Col lg={3} />
                    </Row>
                    <Row>
                      <Col lg={3} />
                      <Col lg={2}>
                        <label>Sheet Width (in.)</label>
                      </Col>
                      <Col lg={2}>
                        <AvField
                          name="username"
                          placeholder="Enter your username"
                          value={this.state.username}
                          required
                        />
                      </Col>
                      <Col lg={3} />
                    </Row>
                    <Row>
                      <Col lg={3} />
                      <Col lg={2}>
                        <label>Length (in.)</label>
                      </Col>
                      <Col lg={2}>
                        <AvField
                          name="username"
                          placeholder="Enter your username"
                          value={this.state.username}
                          required
                        />
                      </Col>
                      <Col lg={3} />
                    </Row>
                    <Row>
                      <Col lg={3} />
                      <Col lg={2}>
                        <label># Sheets</label>
                      </Col>
                      <Col lg={2}>
                        <AvField
                          name="username"
                          placeholder="Enter your username"
                          type="number"
                          required
                        />
                      </Col>
                      <Col lg={3} />
                    </Row>
                    <Row>
                      <Col lg={3} />
                      <Col lg={2}>
                        <label>Max Customer Wt per skid (lb.)</label>
                      </Col>
                      <Col lg={2}>
                        <AvField
                          name="username"
                          placeholder="Enter your username"
                          value={this.state.username}
                          type="number"
                          required
                        />
                      </Col>
                      <Col lg={3} />
                    </Row>
                    <Row>
                      <Col lg={3} />
                      <Col lg={2}>
                        <label>Replacement cost - $/cwt.</label>
                      </Col>
                      <Col lg={2}>
                        <AvField
                          name="username"
                          placeholder="Enter your username"
                          value={this.state.username}
                          type="number"
                        />
                      </Col>
                      <Col lg={3} />
                    </Row>
                    <Row>
                      <Col lg={3} />
                      <Col lg={2}>
                        <label>Paper/Plastic Wrap</label>
                      </Col>
                      <Col lg={2}>
                        <AvCheckboxGroup inline name="chkWrap">
                          <AvCheckbox value="1" />
                        </AvCheckboxGroup>
                      </Col>
                      <Col lg={3} />
                    </Row>
                    <Row>
                      <Col lg={3} />
                      <Col lg={2}>
                        <label>Skid Type</label>
                      </Col>
                      <Col lg={2}>
                        <AvField
                          name="username"
                          placeholder="Enter your username"
                          value={this.state.username}
                          required
                        />
                      </Col>
                      <Col lg={3} />
                    </Row>
                    <Row>
                      <Col lg={3} />
                      <Col lg={2}>
                        <label>Run Remaining Coil to Std Size?</label>
                      </Col>
                      <Col lg={3}>
                        <AvCheckboxGroup inline name="chkRunCoil">
                          <AvCheckbox value="1" />
                        </AvCheckboxGroup>
                      </Col>
                      <Col lg={3} />
                    </Row>
                    <Row>
                      <Col lg={3} />
                      <Col lg={2}>
                        <label>Proposed Price $/cwt.</label>
                      </Col>
                      <Col lg={2}>
                        <AvField name="proposedPrice" type="number" required />
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
}

export default connect()(DefaultDashboard);
