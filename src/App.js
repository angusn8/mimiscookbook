import { useState, useEffect } from "react";
import { connectSupabase } from "./utils/supabase";

function App() {
  useEffect(() => {
    connectSupabase();
  }, []);

  return <h1>Mimi's Cookbook</h1>;
}

export default App;
