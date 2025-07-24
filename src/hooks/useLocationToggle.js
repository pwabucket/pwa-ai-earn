import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";

export default function useLocationToggle(key) {
  const navigate = useNavigate();
  const location = useLocation();
  const show = location.state?.[key] === true;

  /** Toggle Address Picker */
  const toggle = useCallback(
    (status) => {
      if (status) {
        navigate(null, {
          state: {
            ...location.state,
            [key]: true,
          },
        });
      } else {
        navigate(location.key !== "default" ? -1 : "/", { replace: true });
      }
    },
    [key, navigate, location]
  );

  return useMemo(() => [show, toggle], [show, toggle]);
}
