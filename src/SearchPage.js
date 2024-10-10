import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SearchNavbar from "./components/Navbar";
import "./static/css/SearchPage.css";

const SearchPage = ({ user, recipes, profile }) => {
  const location = useLocation();
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("query");
    if (query) {
      // Filter recipes based on the search query
      const filtered = recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredRecipes(filtered);
    } else {
      setFilteredRecipes(recipes);
    }
  }, [location.search, recipes]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <SearchNavbar />
      <div>
        <div className="welcome-msg">
          {profile.full_name},<p>Welcome to Mimi's Cookbook!</p>
        </div>

        <div className="homepage-recipes">
          <ul>
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map((recipe) => (
                <a key={recipe.id} href={`/recipe/${recipe.id}`}>
                  <li>
                    <img src={recipe.photo_path} alt={recipe.title} />
                    <h4>{recipe.title}</h4>
                    <p>@{recipe.username}</p>
                    <div className="recipe-stars">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      (0 reviews)
                    </div>
                  </li>
                </a>
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
