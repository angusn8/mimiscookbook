import { useState, useEffect } from "react";
import { connectSupabase } from "./supabase";

const cache = new Map();

export function useSupabaseData(key, fetchFunction) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const supabase = connectSupabase();

  useEffect(() => {
    async function fetchData() {
      if (cache.has(key)) {
        setData(cache.get(key));
        setLoading(false);
        return;
      }

      try {
        const result = await fetchFunction(supabase);
        cache.set(key, result);
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [key]);

  return { data, loading, error };
}
