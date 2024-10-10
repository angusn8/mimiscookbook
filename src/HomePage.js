import React from "react";
import "./static/css/HomePage.css";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="homepage-content">
      <div className="homepage-text-left"></div>
      <div className="homepage-text-right">
        <p className="homepage-welcome">Welcome to Mimi's Cookbook!</p>
        <p className="homepage-subwelcome">
          Sign in to view our assortment of recipes.
        </p>
        <div className="sign-in-btn">
          <Link to="/auth">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
