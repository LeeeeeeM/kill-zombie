import { useEffect, useState } from "react";

export const useVisibile = (): boolean => {
  const [isVisible, setIsVisible] = useState(true); // 默认页面是可见的

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return isVisible;
}
