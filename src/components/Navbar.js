import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../static/css/Navbar.css";
import { connectSupabase } from "../utils/supabase";

const SearchNavbar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const supabase = connectSupabase();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${query}`);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log("Error logging out:", error.message);
    } else {
      console.log("User logged out successfully");
      // You can redirect the user after logging out, if needed
      window.location.href = "/auth/login";
    }
    console.log("Logout action");
  };

  return (
    <div className="navbar">
      <a href="/" className="logo-text-link">
        <div className="logo-text">Mimi's Cookbook</div>
      </a>
      <form
        className="searchbar"
        id="search-form"
        onSubmit={handleSearchSubmit}
      >
        <input
          type="text"
          name="query"
          id="query"
          placeholder="Search.."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">
          <i className="fa fa-search"></i>
        </button>
      </form>
      <div>
        <button
          onClick={() =>
            document.getElementById("nav-links").classList.toggle("show")
          }
          className="nav-bars"
        >
          <i className="fas fa-bars"></i>
        </button>
        <ul id="nav-links" className="nav-links">
          <li>
            <a href="#" onClick={handleLogout}>
              Logout
            </a>
          </li>
          <li>
            <a href="/profile">Profile</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SearchNavbar;
