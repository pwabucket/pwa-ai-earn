import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import useAppContext from "./useAppContext";

export default function useGoogleProfileQuery() {
  const { googleApi } = useAppContext();
  const { authorized } = googleApi!;

  return useQuery({
    enabled: authorized,
    queryKey: ["google-drive", "user-profile", authorized],
    queryFn: () =>
      axios
        .get(`https://www.googleapis.com/oauth2/v2/userinfo`, {
          headers: {
            Authorization: `Bearer ${gapi.client.getToken()["access_token"]}`,
          },
        })
        .then((res) => res.data),
  });
}
