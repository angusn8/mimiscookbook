import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SignupForm from "./components/SignUpForm";
import LoginForm from "./components/LogInForm";
import AuthNav from "./components/AuthNav";

const AuthPage = () => {
  const location = useLocation();
  const isLogin = location.pathname === "/auth/login";

  return (
    <div className="auth-page">
      <AuthNav />
      {isLogin ? <LoginForm /> : <SignupForm />}
    </div>
  );
};

export default AuthPage;
