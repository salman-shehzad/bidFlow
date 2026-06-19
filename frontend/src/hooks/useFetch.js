import { useEffect, useState } from "react";
import { api } from "../api/client.js";

export function useFetch(path, initial = null) {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api.get(path)
      .then((res) => alive && setData(res.data))
      .catch((err) => alive && setError(err.response?.data?.message || err.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [path]);

  return { data, setData, loading, error };
}
