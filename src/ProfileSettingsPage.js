import React, { useState, useEffect } from "react";
import { connectSupabase } from "./utils/supabase";
import SearchNavbar from "./components/Navbar";
import "./static/css/ProfileSettingsPage.css";
import { useNavigate } from "react-router-dom";

const ProfileSettingsPage = ({ user, profile }) => {
  const navigate = useNavigate();
  const supabase = connectSupabase();
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [username, setUsername] = useState(profile?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(profile?.profile_picture || "");
  const [loading, setLoading] = useState(true); // Loading state

  // Handle profile data loading
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name);
      setUsername(profile.username);
      setBio(profile.bio);
      setImageUrl(profile.profile_picture);
      setLoading(false); // Stop loading once profile is loaded
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
    if (!image) return;

    const { data, error } = await supabase.storage
      .from("profiles")
      .upload(`public/${user.id}/avatar.png`, image);

    if (error) {
      console.error("Error uploading image:", error);
    } else {
      console.log("Image uploaded successfully:", data);
      const { publicURL } = supabase.storage
        .from("profiles")
        .getPublicUrl(data.path);
      await updateProfileImage(publicURL);
    }
  };

  const updateProfileImage = async (url) => {
    const { error } = await supabase
      .from("profiles")
      .update({ profile_picture: url })
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating profile image:", error);
    } else {
      console.log("Profile image updated successfully.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleUpload();

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        username: username,
        bio: bio,
      })
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating profile:", error);
    } else {
      console.log("Profile updated successfully.");
      navigate("/profile", {
        state: {
          profile: {
            full_name: fullName,
            username: username,
            bio: bio,
            profile_picture: imageUrl,
          },
        },
      });
    }
  };

  // Loading fallback
  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div>
      <SearchNavbar />
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
            <i className="fas fa-signature"></i>
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
            <i className="fas fa-user"></i>
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
            <i className="fas fa-envelope"></i>
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
            <i className="fas fa-scroll"></i>
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

        <input className="change-btn" type="submit" value="Update Profile" />
      </form>
    </div>
  );
};

export default ProfileSettingsPage;
