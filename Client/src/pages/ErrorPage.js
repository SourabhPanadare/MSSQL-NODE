import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import { getLoggedInUser } from "../helpers/authUtils";

function ErrorPage() {
  const [currentUser, setCurrentUser] = useState(getLoggedInUser());
  return (
    <div>
      <Row>
        <Col lg={4}></Col>
        <Col lg={4}>
          <div class="card" style={{ marginTop: 200 }}>
            <div class="card-body p-4">
              <div class="text-center">
                <h1 class="text-error">500</h1>
                <h3 class="mt-3 mb-2">Internal Server Error</h3>
                {currentUser.role == "User" ? (
                  <a
                    href="../InputQuote"
                    class="btn btn-danger waves-effect waves-light"
                  >
                    <i class="fas fa-home mr-1"></i> Back to Home
                  </a>
                ) : (
                  <a
                    href="../Quotations"
                    class="btn btn-danger waves-effect waves-light"
                  >
                    <i class="fas fa-home mr-1"></i> Back to Home
                  </a>
                )}
              </div>
            </div>
          </div>
        </Col>
        <Col lg={4}></Col>
      </Row>
    </div>
  );
}

export default ErrorPage;
