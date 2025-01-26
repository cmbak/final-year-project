import { useQuery, useQueryClient } from "@tanstack/react-query";
import CreateModal from "../CreateModal/CreateModal";
import styles from "./Dashboard.module.css";
import { fetchCategories } from "../../utils/fetchCategories";
import { fetchUser } from "../../utils/fetchUser";

type Category = {
  id: number;
  name: string;
  user: number;
};

export default function Dashboard() {
  const user = useQuery({ queryKey: ["user"], queryFn: fetchUser });
  const { isPending, isError, data } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(user.data.id),
  });

  return (
    <main className={`flex flex-col ${styles.container}`}>
      <h1 className={styles.heading}>my quizzes</h1>
      {/* TODO Search bar, create quiz button here */}
      {/* TODO sep component? */}
      <div className={styles.categories}>
        {data.map(({ id, name }: Category) => (
          <div key={id} className={styles.category}>
            <h2>{name}</h2>
          </div>
        ))}
      </div>
      <div className={styles.modalBtnContainers}>
        <CreateModal
          endpoint="/api/categories/"
          inputId="create-category-name"
          title="create category"
        />
        <CreateModal
          endpoint="/api/labels/"
          inputId="create-label-name"
          title="create label"
        />
      </div>
    </main>
  );
}
