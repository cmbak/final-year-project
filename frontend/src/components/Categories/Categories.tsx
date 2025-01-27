import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../../utils/fetchCategories";
import { fetchUser } from "../../utils/fetchUser";
import { Category } from "../../types";
import styles from "./Categories.module.css";
import Quizzes from "../Quizzes/Quizzes";

export default function Categories() {
  const user = useQuery({ queryKey: ["user"], queryFn: fetchUser });
  const userId = user.data?.id;

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["categories", userId], // Depends on userId
    queryFn: () => fetchCategories(userId),
    enabled: Boolean(userId), // Only calls queryfn in userId not undefined/null
  });

  if (isPending) {
    return <h1>TEMP Loading...</h1>;
  }

  if (isError) {
    return <h1>TEMP Error {error.message}</h1>;
  }

  return (
    <div className={styles.categories}>
      {data.map(({ id, name }: Category) => (
        <div key={id} className={styles.category}>
          <h2>{name}</h2>
          <Quizzes userId={userId} categoryId={id} />
        </div>
      ))}
    </div>
  );
}
