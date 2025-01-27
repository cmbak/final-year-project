import { Category } from "../../types";
import styles from "./Categories.module.css";
import Quizzes from "../Quizzes/Quizzes";
import useCategories from "../../hooks/useCategories";

export default function Categories() {
  const { isPending, isError, data, error, userId } = useCategories();

  if (isPending) {
    return <h1>TEMP Loading...</h1>;
  }

  if (isError) {
    return <h1>TEMP Error {error?.message}</h1>;
  }

  return (
    <div className={styles.categories}>
      {data?.map(({ id, name }: Category) => (
        <div key={id} className={styles.category}>
          <h2>{name}</h2>
          <Quizzes userId={userId} categoryId={id} />
        </div>
      ))}
    </div>
  );
}
