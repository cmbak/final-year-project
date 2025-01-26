import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../../utils/fetchCategories";
import { fetchUser } from "../../utils/fetchUser";
import { Category } from "../../types";
import styles from "./Categories.module.css";

export default function Categories() {
  const user = useQuery({ queryKey: ["user"], queryFn: fetchUser });
  const { isPending, isError, data } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(user.data.id),
  });

  if (isPending) {
    return <h1>TEMP Loading...</h1>;
  }

  if (isError) {
    return <h1>TEMP Error...</h1>;
  }

  return (
    <div className={styles.categories}>
      {data.map(({ id, name }: Category) => (
        <div key={id} className={styles.category}>
          <h2>{name}</h2>
        </div>
      ))}
    </div>
  );
}
