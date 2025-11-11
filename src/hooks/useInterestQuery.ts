import { useQuery } from "@tanstack/react-query";

import useAppContext from "./useAppContext";

export default function useInterestQuery() {
  const { enabled, tracker } = useAppContext().tracker!;

  return useQuery({
    enabled,
    queryKey: ["interest"],
    queryFn: () => tracker!.getInterests(),
  });
}
