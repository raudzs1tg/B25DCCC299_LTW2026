import { useEffect, useState } from 'react';

export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) {
          throw new Error(`Lỗi HTTP: ${res.status}`);
        }
        const json = await res.json();
        setData(json);
        setLoading(false);
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();

    return () => {
      controller.abort();
    };
  }, [url]);

  return { data, loading, error };
};