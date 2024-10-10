import React from "react";
import { Link } from "react-router-dom";
import "../static/css/AuthNav.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const AuthNav = () => {
  return (
    <div className="navbar">
      <Link to="/" className="back-home-link">
        <FontAwesomeIcon icon={faArrowLeft} /> Back to Home
      </Link>
    </div>
  );
};

export default AuthNav;
