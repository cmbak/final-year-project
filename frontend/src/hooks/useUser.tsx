import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../utils/fetchUser";

// Hook which fetches the currently logged in user (as returned from the api)
export default function useUser() {
  const { data, isError, error, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  return { data, isError, error, isPending };
}
