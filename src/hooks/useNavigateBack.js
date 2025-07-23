import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router";

export default function useNavigateBack() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateBack = useCallback(
    /**
     *
     * @param {import("react-router").NavigateOptions} options
     * @returns
     */
    (options) => {
      return navigate(location.key !== "default" ? -1 : "/", options);
    },
    [location, navigate]
  );

  return navigateBack;
}
