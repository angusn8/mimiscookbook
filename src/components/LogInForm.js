import React from "react";
import { useState, useEffect } from "react";
import { connectSupabase } from "../utils/supabase";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

const LoginForm = ({ onSubmit, msg }) => {
  const supabase = connectSupabase();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(location.pathname === "/auth/login");

  useEffect(() => {
    setIsLogin(location.pathname === "/auth/login");
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const { user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      console.log("User logged in:", user);
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login">
      <h1>Login</h1>
      <div className="links">
        <Link to="/auth/login" className={isLogin ? "active" : ""}>
          Login
        </Link>
        <Link to="/auth/register" className={!isLogin ? "active" : ""}>
          Register
        </Link>
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">
          <FontAwesomeIcon icon={faEnvelope} />
        </label>
        <input
          type="text"
          name="email"
          placeholder="Email"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
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
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="msg">{msg}</div> {/* Display message if needed */}
        <input type="submit" value="Login" />
      </form>
    </div>
  );
};

export default LoginForm;
