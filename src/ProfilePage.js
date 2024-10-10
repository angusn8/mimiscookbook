import React from "react";
import { Link } from "react-router-dom";
import "./static/css/ProfilePage.css";
import SearchNavbar from "./components/Navbar";
import { profile } from "./static/img/blank-profile-picture.webp";

const ProfilePage = ({ user, profile, recipes }) => {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <i key={i} className={`fas fa-star ${i < rating ? "filled" : ""}`}></i>
      );
    }
    return stars;
  };

  if (!profile) {
    return <div>Loading...</div>;
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
                <i className="fas fa-plus"></i>
                <span className="hide-upload-btn-content">Upload Recipe</span>
              </button>
            </Link>
          </div>
        </div>
        <Link to="/profile/update">
          <button className="settingsbtn2">
            <i className="fa fa-gear"></i>
          </button>
        </Link>
        <div className="profile-body">
          <div className="left-side">
            <div className="profile-side">
              <p className="user-subscribers">
                <i className="fas fa-user-alt"></i>
                {profile.subscribers} subscribers
              </p>
              <p className="user-email">
                <i className="fas fa-envelope"></i>
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
                  <i className="fa fa-gear"></i>Profile Settings
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
                {recipes.map((recipe) => (
                  <Link key={recipe.id} to={`/recipe/${recipe.id}`}>
                    <li>
                      <img src={recipe.photo_path} alt="" />
                      <h4>{recipe.title}</h4>
                      <p>@{user.username}</p>
                      <div className="recipe-stars">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        (0 reviews)
                      </div>
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
