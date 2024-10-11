import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../static/css/Navbar.css";
import { connectSupabase } from "../utils/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBars } from "@fortawesome/free-solid-svg-icons";

const SearchNavbar = () => {
  const [query, setQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const supabase = connectSupabase();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("q");
    if (searchQuery) {
      setQuery(searchQuery);
    }
  }, [location.search]);

  const handleSearchChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (newQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(newQuery.trim())}`);
    } else {
      navigate("/");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log("Error logging out:", error.message);
    } else {
      console.log("User logged out successfully");
      window.location.href = "/auth/login";
    }
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
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
          onChange={handleSearchChange}
        />
        <button type="submit">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </form>
      <div className="menu-container">
        <button onClick={toggleMenu} className="nav-bars">
          <FontAwesomeIcon icon={faBars} />
        </button>
        <ul className={`nav-links ${showMenu ? "show" : ""}`}>
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
