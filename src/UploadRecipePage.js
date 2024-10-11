import React, { useState, useEffect } from "react";
import { connectSupabase } from "./utils/supabase";
import "./static/css/UploadRecipePage.css";
import SearchNavbar from "./components/Navbar";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

const UploadRecipePage = () => {
  const supabase = connectSupabase();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [servings, setServings] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [directions, setDirections] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
        } else {
          setProfile(profileData);
        }
      }
    };

    fetchUserAndProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !profile) {
      console.error("User or profile not loaded");
      return;
    }

    let photoPath = "";
    if (image) {
      const fileExt = image.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("recipes")
        .upload(filePath, image);

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("recipes")
        .getPublicUrl(filePath);

      photoPath = urlData.publicUrl;
    }

    // Convert servings to an integer
    const servingsInt = parseInt(servings, 10);

    // Ensure prepTime is a string
    const prepTimeString = prepTime.toString();

    const { data, error } = await supabase.from("recipes").insert([
      {
        title,
        time: prepTimeString,
        servings: servingsInt,
        ingredients,
        directions,
        photo_path: photoPath,
        user_id: user.id, // This should be a UUID
        username: profile.username,
      },
    ]);

    if (error) {
      console.error("Error uploading recipe:", error);
    } else {
      console.log("Recipe uploaded successfully:", data);
      resetForm();
      navigate("/profile", { state: { profile: profile } });
    }
  };

  const resetForm = () => {
    setTitle("");
    setPrepTime("");
    setServings("");
    setIngredients("");
    setDirections("");
    setImage(null);
    setImageUrl("");
  };

  if (!user || !profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <SearchNavbar />
      <div className="upload-form-container">
        <div className="upload-form">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="recipe-name">
              <label htmlFor="title">Recipe Name:&nbsp;</label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="time-and-servings">
              <div>
                <label htmlFor="prep_time">Time to Prepare:</label>
                <input
                  type="text"
                  id="prep_time"
                  name="prep_time"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="servings">Servings:</label>
                <input
                  type="text"
                  id="servings"
                  name="servings"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="ingredients">
              <label htmlFor="ingredients">Ingredients:</label>
              <textarea
                id="ingredients"
                name="ingredients"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                rows="8"
                required
              ></textarea>
            </div>
            <div className="directions">
              <label htmlFor="directions">Directions:</label>
              <textarea
                id="directions"
                name="directions"
                value={directions}
                onChange={(e) => setDirections(e.target.value)}
                rows="10"
                required
              ></textarea>
            </div>
            <div className="recipe-image">
              <label className="upload-image-btn">
                <FontAwesomeIcon icon={faUpload} /> Upload Image
                <input
                  type="file"
                  accept="image/*"
                  id="recipe_image"
                  name="recipe_image"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </label>
              {imageUrl && <img src={imageUrl} alt="Preview" width="200" />}{" "}
              {/* Optional preview */}
            </div>
            <div className="submit-upload">
              <input type="submit" value="Submit My Recipe!" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadRecipePage;
