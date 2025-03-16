import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../utils/fetchUser";

// Hook which fetches the categories for the logged in user
export default function useCategories() {
  const user = useQuery({ queryKey: ["user"], queryFn: fetchUser });
  const userId = user.data?.id;

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["categories", userId], // Depends on userId
    queryFn: () => fetchCategories(userId),
    enabled: Boolean(userId), // Only calls queryfn in userId not undefined/null
  });

  return { isPending, isError, data, error, userId };
}
