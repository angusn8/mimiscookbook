import React, { useEffect, useState } from "react";
import HomePage from "./HomePage";
import SearchPage from "./SearchPage";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { connectSupabase } from "./utils/supabase";
import ProfilePage from "./ProfilePage";
import ProfileSettingsPage from "./ProfileSettingsPage";
import AuthPage from "./AuthPage";
import UploadRecipePage from "./UploadRecipePage";

const App = () => {
  const supabase = connectSupabase();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    connectSupabase();

    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    const fetchRecipes = async () => {
      try {
        const { data, error } = await supabase.from("recipes").select("*");

        if (error) throw error;

        setRecipes(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", user.id)
            .single();

          if (error) throw error;
          console.log(data);
          setProfile(data);
        } catch (error) {
          console.error("Error fetching profile:", error.message);
        }
      }
    };

    fetchProfile();
  }, [user]);

  useEffect(() => {
    if (profile) {
      console.log("Updated profile state:", profile);
    }
  }, [profile]);

  const userRecipes = recipes.filter(
    (recipe) => recipe.username === profile?.username
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              {user ? (
                <SearchPage user={user} recipes={recipes} profile={profile} />
              ) : (
                <HomePage />
              )}
            </div>
          }
        />
        <Route
          path="/profile"
          element={
            <ProfilePage user={user} profile={profile} recipes={userRecipes} />
          }
        />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/register" element={<AuthPage />} />
        <Route path="/auth/login" element={<AuthPage />} />
        <Route
          path="/profile/update"
          element={<ProfileSettingsPage user={user} profile={profile} />}
        />
        <Route path="/recipe/upload" element={<UploadRecipePage />} />
        <Route path="/auth/login" element={<AuthPage />} />
        <Route path="/auth/register" element={<AuthPage />} />
      </Routes>
    </Router>
  );
};

export default App;
