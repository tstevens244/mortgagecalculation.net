import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { resetUrlState } from "@/lib/urlState";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    // A new page starts with a clean URL until its own inputs change.
    resetUrlState();
  }, [pathname]);

  return null;
};

export default ScrollToTop;
