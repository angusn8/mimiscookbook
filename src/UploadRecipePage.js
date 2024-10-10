import React, { useState } from "react";
import { connectSupabase } from "./utils/supabase";

const UploadRecipePage = () => {
  const supabase = connectSupabase();
  const [title, setTitle] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [servings, setServings] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [directions, setDirections] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

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

    let imageUrl = "";
    if (image) {
      const { data, error: uploadError } = await supabase.storage
        .from("recipes")
        .upload(`public/${image.name}`, image);

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        return;
      }

      const { publicURL } = supabase.storage
        .from("recipes")
        .getPublicUrl(data.path);
      imageUrl = publicURL;
    }
    const { error } = await supabase.from("recipes").insert([
      {
        title,
        time: prepTime,
        servings,
        ingredients,
        directions,
        photo_path: imageUrl,
      },
    ]);

    if (error) {
      console.error("Error uploading recipe:", error);
    } else {
      console.log("Recipe uploaded successfully!");
      resetForm();
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

  return (
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
              <i className="fa fa-upload"></i> Upload Image
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
  );
};

export default UploadRecipePage;
