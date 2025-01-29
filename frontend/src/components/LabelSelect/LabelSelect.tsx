import { useQuery } from "@tanstack/react-query";
import { fetchLabels } from "../../utils/fetchLabels";
import styles from "./LabelSelect.module.css";
import { useState } from "react";
import Label from "../Label/Label";

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

  // TODO pending and error messages
  if (isPending) return <h1>Loading...</h1>;
  if (isError) return <h1>Error {error.message}</h1>;

  return (
    <ul className={`flex ${styles.labelList}`}>
      {data.map(({ id, name }) => (
        <Label key={id} name={name} id={id} />
      ))}
    </ul>
  );
}
