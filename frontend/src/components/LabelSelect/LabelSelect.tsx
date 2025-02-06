import { useQuery } from "@tanstack/react-query";
import { fetchLabels } from "../../utils/fetchLabels";
import Label from "../Label/Label";
import { StateSetter } from "../../types";

type LabelSelectProps = {
  userId: number | undefined; // TODO how to ensure that userid is defined
  setSelectedIds: StateSetter<number[]>;
};

export default function LabelSelect({
  userId,
  setSelectedIds,
}: LabelSelectProps) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["labels", userId],
    queryFn: () => fetchLabels(userId),
    enabled: Boolean(userId),
  });

  // TODO pending and error messages
  if (isPending) return <h1>Loading...</h1>;
  if (isError) return <h1>Error {error.message}</h1>;

  return (
    <ul className="flex" style={{ gap: "0.2rem" }}>
      {data.map(({ id, name }) => (
        <Label key={id} name={name} id={id} setSelectedIds={setSelectedIds} />
      ))}
    </ul>
  );
}
