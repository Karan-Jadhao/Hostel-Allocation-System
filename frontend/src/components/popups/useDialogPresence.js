import { useEffect, useState } from "react";

export function useDialogPresence(open, exitDuration = 180) {
  const [present, setPresent] = useState(open);
  const isExiting = present && !open;

  useEffect(() => {
    if (open) {
      const timer = window.setTimeout(() => setPresent(true), 0);
      return () => window.clearTimeout(timer);
    }
    if (!present) return undefined;
    const timer = window.setTimeout(() => setPresent(false), exitDuration);
    return () => window.clearTimeout(timer);
  }, [exitDuration, open, present]);

  return { present, isExiting };
}
