import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { connectSupabase } from "../utils/supabase";
import "../static/css/AuthForms.css";
import {
  faEnvelope,
  faLock,
  faSignature,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SignUpForm = () => {
  const supabase = connectSupabase();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(null);
  const [msg, setMsg] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const user = data?.user;

    if (user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([{ full_name: fullName, username, user_id: user.id }]);

      if (profileError) {
        setError(profileError.message);
      } else {
        console.log("User registered successfully:", user);
        setMsg("Registration successful!");
        navigate("/");
      }
    } else {
      setError("User creation failed.");
    }

    setLoading(false);
  };

  return (
    <div className="register">
      <h1>Register</h1>
      <div className="links">
        <Link
          to="/auth/login"
          className={isLogin ? "" : "active"}
          onClick={toggleForm}
        >
          Login
        </Link>
        <Link
          to="/auth/register"
          className={isLogin ? "active" : ""}
          onClick={toggleForm}
        >
          Register
        </Link>
      </div>
      <form onSubmit={handleSubmit} autoComplete="off">
        <label htmlFor="full_name">
          <FontAwesomeIcon icon={faSignature} />
        </label>
        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          id="full_name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <label htmlFor="username">
          <FontAwesomeIcon icon={faUser} />
        </label>
        <input
          type="text"
          name="username"
          placeholder="Username"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="password">
          <FontAwesomeIcon icon={faLock} />
        </label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label htmlFor="email">
          <FontAwesomeIcon icon={faEnvelope} />
        </label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {msg && <div className="msg">{msg}</div>}{" "}
        {/* Display message if exists */}
        <input type="submit" value="Register" />
      </form>
    </div>
  );
};

export default SignUpForm;
