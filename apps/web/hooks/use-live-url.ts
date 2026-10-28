"use client";

import { useEffect, useState } from "react";

export function useLiveUrl(formId?: string) {
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  if (!formId || !origin) return "";

  return `${origin}/live/${formId}`;
}
