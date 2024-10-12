import React, { useEffect, useState } from "react";
import HomePage from "./HomePage";
import SearchPage from "./SearchPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { connectSupabase } from "./utils/supabase";
import ProfilePage from "./ProfilePage";
import ProfileSettingsPage from "./ProfileSettingsPage";
import AuthPage from "./AuthPage";
import UploadRecipePage from "./UploadRecipePage";
import RecipePage from "./RecipePage";
import { useSupabaseData } from "./utils/useSupabaseData";

const App = () => {
  const supabase = connectSupabase();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const {
    data: profile,
    error: profileError,
    loading: profileLoading,
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
    error: recipesError,
    loading: recipesLoading,
  } = useSupabaseData("allRecipes", async (supabase) => {
    const { data, error } = await supabase.from("recipes").select("*");
    if (error) throw error;
    return data;
  });

  if (loading || profileLoading || recipesLoading) {
    return <div>Loading...</div>;
  }

  if (profileError || recipesError) {
    console.error("Error loading data:", profileError || recipesError);
    return <div>Error loading data. Please try again.</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <SearchPage user={user} profile={profile} recipes={recipes} />
            ) : (
              <HomePage />
            )
          }
        />
        <Route
          path="/profile"
          element={
            <ProfilePage user={user} profile={profile} recipes={recipes} />
          }
        />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/register" element={<AuthPage />} />
        <Route path="/auth/login" element={<AuthPage />} />
        <Route
          path="/profile/update"
          element={<ProfileSettingsPage user={user} profile={profile} />}
        />
        <Route
          path="/recipe/upload"
          element={<UploadRecipePage user={user} profile={profile} />}
        />
        <Route path="/recipe/:id" element={<RecipePage recipes={recipes} />} />
      </Routes>
    </Router>
  );
};

export default App;
