import { useEffect, useState } from "react";

export function useImagePreview(file) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }

    const next = URL.createObjectURL(file);
    setUrl(next);

    return () => URL.revokeObjectURL(next);
  }, [file]);

  return url;
}
