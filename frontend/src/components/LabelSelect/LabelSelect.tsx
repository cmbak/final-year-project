import { useQuery } from "@tanstack/react-query";
import { fetchLabels } from "../../utils/fetchLabels";
import styles from "./LabelSelect.module.css";
import { useState } from "react";

type LabelSelectProps = {
  userId: number | undefined; // TODO how to ensure that userid is defined
};

export default function LabelSelect({ userId }: LabelSelectProps) {
  const [selectedLabelIds, setSelectedLabelIds] = useState<number[]>([]);
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["labels", userId],
    queryFn: () => fetchLabels(userId),
    enabled: Boolean(userId),
  });

  function handleClick(id: number) {
    setSelectedLabelIds((prevLabelIds) => {
      // if id in state array, remove it
      const index = prevLabelIds.indexOf(id);
      if (index > -1) {
        return prevLabelIds.filter((prevId) => prevId !== id);
      } else {
        // otherwise add it
        return [...prevLabelIds, id];
      }
    });
  }

  // TODO pending and error messages
  if (isPending) return <h1>Loading...</h1>;
  if (isError) return <h1>Error {error.message}</h1>;

  return (
    <>
      {/* 
      - When
       they press on label, toggle selected/deselected
      */}
      <ul className={`flex ${styles.labelList}`}>
        {data.map(({ id, name }) => (
          <li key={id} className={styles.label} onClick={() => handleClick(id)}>
            {name}
          </li>
        ))}
      </ul>
    </>
  );
}
