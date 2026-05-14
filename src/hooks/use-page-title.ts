import { useEffect } from "react";

export function usePageTitle(title: string) {
  useEffect(() => {
    const appName = import.meta.env.VITE_APP_NAME || "Admin";
    document.title = title ? `${title} — ${appName}` : appName;
  }, [title]);
}

export default usePageTitle;
