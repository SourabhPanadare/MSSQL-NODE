import React from "react";
import Loader from "react-loader-spinner";

function PageLoader() {
  const divStyle = {
    position: "absolute",
    left: "50%",
    top: "50%",
    zIndex: 9999,
  };
  return (
    <div>
      <Loader type="ThreeDots" color="#71B6F9" height={80} width={80}></Loader>
    </div>
  );
}

export default PageLoader;
