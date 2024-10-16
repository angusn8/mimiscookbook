import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import SearchNavbar from "./components/Navbar";
import "./static/css/SearchPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const SearchPage = ({ user, profile, recipes }) => {
  const location = useLocation();
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("q");
    if (recipes) {
      if (query) {
        const filtered = recipes.filter((recipe) =>
          recipe.title.toLowerCase().startsWith(query.toLowerCase())
        );
        setFilteredRecipes(filtered);
      } else {
        setFilteredRecipes(recipes);
      }
    }
  }, [location.search, recipes]);

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div>
      <SearchNavbar />
      <div>
        {location.search ? (
          <div className="search-results-msg"></div>
        ) : (
          <div className="welcome-msg">
            {profile.full_name},<p>Welcome to Mimi's Cookbook!</p>
          </div>
        )}
        <div className="homepage-recipes">
          <ul>
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map((recipe) => (
                <Link key={recipe.id} to={`/recipe/${recipe.id}`}>
                  <li>
                    <img src={recipe.photo_path} alt={recipe.title} />
                    <h4>{recipe.title}</h4>
                    <p>@{recipe.username}</p>
                    <div className="recipe-stars">
                      {[...Array(5)].map((_, index) => (
                        <FontAwesomeIcon key={index} icon={faStar} />
                      ))}
                      (0 reviews)
                    </div>
                  </li>
                </Link>
              ))
            ) : (
              <p>No recipes found.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
