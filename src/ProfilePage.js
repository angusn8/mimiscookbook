import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./static/css/ProfilePage.css";
import SearchNavbar from "./components/Navbar";
import { profile as defaultProfileImage } from "./static/img/blank-profile-picture.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faUserAlt,
  faEnvelope,
  faGear,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useSupabaseData } from "./utils/useSupabaseData";

const ProfilePage = ({ user, initialProfile }) => {
  const {
    data: profile,
    loading: profileLoading,
    error: profileError,
  } = useSupabaseData(`profile_${user?.id}`, async (supabase) => {
    if (user) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (error) throw error;
      return data;
    }
    return null;
  });

  const {
    data: recipes,
    loading: recipesLoading,
    error: recipesError,
  } = useSupabaseData(`user_recipes_${user?.id}`, async (supabase) => {
    if (user) {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("user_id", user.id);
      if (error) throw error;
      return data;
    }
    return [];
  });

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          className={i < rating ? "filled" : ""}
        />
      );
    }
    return stars;
  };

  if (profileLoading || recipesLoading) {
    return <div>Loading...</div>;
  }

  if (profileError || recipesError) {
    return <div>Error loading profile or recipes</div>;
  }

  if (!profile) {
    return <div>Error loading profile</div>;
  }

  return (
    <div>
      <SearchNavbar />
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-img">
            {profile.profile_picture != null ? (
              <img src={profile.profile_picture} width="200" alt="" />
            ) : (
              <img src={profile} width="200" alt="" />
            )}
          </div>
          <div className="profile-name-info">
            <h3 className="user-name">{profile.full_name}</h3>
            <div className="user-username">
              <p>@{profile.username}</p>
            </div>
          </div>
          <div className="uploadbtn-container">
            <Link to="/recipe/upload">
              <button className="uploadbtn">
                <FontAwesomeIcon icon={faPlus} />
                <span className="hide-upload-btn-content">Upload Recipe</span>
              </button>
            </Link>
          </div>
        </div>
        <Link to="/profile/update">
          <button className="settingsbtn2">
            <FontAwesomeIcon icon={faGear} />
          </button>
        </Link>
        <div className="profile-body">
          <div className="left-side">
            <div className="profile-side">
              <p className="user-subscribers">
                <FontAwesomeIcon icon={faUserAlt} />
                {profile.subscribers} subscribers
              </p>
              <p className="user-email">
                <FontAwesomeIcon icon={faEnvelope} />
                {user.email}
              </p>
              <div className="user-bio">
                <h3>Bio</h3>
                <p>{profile.bio}</p>
              </div>
              <div className="user-rating">
                <h3 className="rating">{profile.rating}</h3>
                <div className="rate">
                  <div className="stars">{renderStars(profile?.rating)}</div>
                </div>
                <div className="no-reviews">{profile.num_reviews} reviews</div>
              </div>
              <Link to="/profile/update">
                <button className="settingsbtn1">
                  <FontAwesomeIcon icon={faGear} />
                  Profile Settings
                </button>
              </Link>
            </div>
          </div>
          <div className="right-side">
            <div className="profile-tabs">
              <ul>
                <li>
                  <button className="tabs-btn active">Uploaded Recipes</button>
                </li>
                <li>
                  <button className="tabs-btn">Purchased Recipes</button>
                </li>
              </ul>
            </div>
            <div className="profile-recipes">
              <ul>
                {recipes && recipes.length > 0 ? (
                  recipes.map((recipe) => (
                    <Link key={recipe.id} to={`/recipe/${recipe.id}`}>
                      <li>
                        <img src={recipe.photo_path} alt="" />
                        <h4>{recipe.title}</h4>
                        <p>@{profile.username}</p>
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
      </div>
    </div>
  );
};

export default ProfilePage;
