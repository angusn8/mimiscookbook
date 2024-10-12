import React, { useState, useEffect } from "react";
import { connectSupabase } from "./utils/supabase";
import SearchNavbar from "./components/Navbar";
import "./static/css/ProfileSettingsPage.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignature,
  faUser,
  faEnvelope,
  faScroll,
} from "@fortawesome/free-solid-svg-icons";
import { useSupabaseData } from "./utils/useSupabaseData";

const ProfileSettingsPage = ({ user }) => {
  const navigate = useNavigate();
  const supabase = connectSupabase();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState(null);

  const {
    data: profile,
    loading,
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

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name);
      setUsername(profile.username);
      setBio(profile.bio);
      setImageUrl(profile.profile_picture);
    }
  }, [profile]);

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

  const handleUpload = async () => {
    if (!image) return null;

    try {
      const fileExt = image.name.split(".").pop();
      const fileName = `${user.id}${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("profiles")
        .upload(filePath, image);

      if (uploadError) throw uploadError;

      const { data: urlData, error: urlError } = supabase.storage
        .from("profiles")
        .getPublicUrl(filePath);

      if (urlError) throw urlError;

      return urlData.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image. Please try again.");
      return null;
    }
  };

  const updateProfileImage = async (url) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ profile_picture: url })
        .eq("user_id", user.id);

      if (error) throw error;

      console.log("Profile image updated successfully.");
    } catch (error) {
      console.error("Error updating profile image:", error);
      setError("Failed to update profile image. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      let newImageUrl = profile.profile_picture; // Default to current profile picture

      if (image) {
        const imageUrl = await handleUpload();
        if (imageUrl) {
          newImageUrl = imageUrl;
        }
      }

      const { data, error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          username: username,
          bio: bio,
          profile_picture: newImageUrl, // Add this line to update the profile picture URL
        })
        .eq("user_id", user.id);

      if (error) throw error;

      console.log("Profile updated successfully:", data);
      navigate("/profile", {
        state: {
          profile: {
            full_name: fullName,
            username: username,
            bio: bio,
            profile_picture: newImageUrl,
          },
        },
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    }
  };

  // Loading fallback
  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div>
      <SearchNavbar />
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="profile-settings-box">
          <div className="setting-heading-color">
            <h3>Profile Picture</h3>
          </div>
          <div>
            <p>Current profile picture</p>
            <div className="profile-img-settings">
              <img src={imageUrl} width="200" alt="Profile" />
            </div>
          </div>
          <hr />
          <h3>Change your profile picture</h3>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <div className="profile-settings-box">
          <div className="setting-heading-color">
            <h3>Name</h3>
          </div>
          <label htmlFor="full_name">
            <FontAwesomeIcon icon={faSignature} />
          </label>
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            id="full-name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="profile-settings-box">
          <div className="setting-heading-color">
            <h3>Username</h3>
          </div>
          <label htmlFor="username">
            <FontAwesomeIcon icon={faUser} />
          </label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="profile-settings-box">
          <div className="setting-heading-color">
            <h3>Email</h3>
          </div>
          <label htmlFor="email">
            <FontAwesomeIcon icon={faEnvelope} />
          </label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="profile-settings-box">
          <div className="setting-heading-color">
            <h3>Bio</h3>
          </div>
          <label htmlFor="bio">
            <FontAwesomeIcon icon={faScroll} />
          </label>
          <input
            type="text"
            name="bio"
            placeholder={profile.bio}
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <input
          className="change-btn"
          type="submit"
          value={loading ? "Updating..." : "Update Profile"}
          disabled={loading}
        />
      </form>
    </div>
  );
};

export default ProfileSettingsPage;
