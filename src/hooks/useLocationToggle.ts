import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";

export default function useLocationToggle(
  key: string
): [boolean, (status: boolean) => void] {
  const navigate = useNavigate();
  const location = useLocation();
  const show = location.state?.[key] === true;

  /** Toggle Address Picker */
  const toggle = useCallback(
    (status: boolean) => {
      if (status) {
        navigate(location, {
          state: {
            ...location.state,
            [key]: true,
          },
        });
      } else {
        if (location.key !== "default") {
          navigate(-1);
        } else {
          navigate("/", { replace: true });
        }
      }
    },
    [key, navigate, location]
  );

  return useMemo(() => [show, toggle], [show, toggle]);
}
