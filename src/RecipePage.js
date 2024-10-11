import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { connectSupabase } from "./utils/supabase";
import SearchNavbar from "./components/Navbar";
import "./static/css/RecipePage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as fasStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";

const RecipePage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const supabase = connectSupabase();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const { data, error } = await supabase
          .from("recipes")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        setRecipe(data);
      } catch (error) {
        setError("Error fetching recipe. Please try again.");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FontAwesomeIcon
        key={index}
        icon={index < Math.round(rating) ? fasStar : farStar}
        className={index < Math.round(rating) ? "star-filled" : "star-empty"}
      />
    ));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!recipe) return <div>Recipe not found.</div>;

  return (
    <div>
      <SearchNavbar />
      <div className="view-recipe">
        <div className="display-recipe-name">
          <h3>{recipe.title}</h3>
          <div className="recipe-user-info">
            <span className="recipe-user">@{recipe.username}</span>
            <span className="recipe-stars">
              {renderStars(recipe.rating || 0)}
              <span className="recipe-reviews">
                ({recipe.num_reviews || 0} reviews)
              </span>
            </span>
          </div>
        </div>
        <div className="recipe-part">
          <div className="ingredient-list">
            <h4>Ingredients</h4>
            <p id="recipe-ingredients">
              <span>{recipe.ingredients}</span>
            </p>
          </div>
          <div className="right-half">
            <div className="recipe-img">
              <img src={recipe.photo_path} alt={recipe.title} />
            </div>
            <div className="time-and-servings">
              <div className="recipe-info">
                <h5>Time to Prepare</h5>
                <p>{recipe.time}</p>
              </div>
              <div className="recipe-info">
                <h5>Servings</h5>
                <p>{recipe.servings}</p>
              </div>
            </div>
            <div className="space"></div>
          </div>
        </div>
        <div className="recipe-part">
          <div className="direction-list">
            <h4>Directions</h4>
            <p id="recipe-directions">
              <span>{recipe.directions}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipePage;
