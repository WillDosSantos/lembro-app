// hooks/usePersistentFlag.ts
import { useEffect, useState } from "react";

export function usePersistentFlag(key: string, defaultValue = false) {
  const [mounted, setMounted] = useState(false);
  const [value, setValue] = useState<boolean>(defaultValue);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) setValue(raw === "true");
    } catch {}
  }, [key]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(key, String(value));
    } catch {}
  }, [key, mounted, value]);

  return { value, setValue, mounted };
}
