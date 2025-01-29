import clsx from "clsx";
import { Label as LabelType } from "../../types";
import { useState } from "react";
import styles from "./Label.module.css";

type LabelProps = {
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
} & Omit<LabelType, "user">;

export default function Label({ id, name, setSelectedIds }: LabelProps) {
  const [selected, setSelected] = useState(false);

  function handleClick() {
    const newState = !selected;
    // Toggle selected state
    setSelected(newState);

    setSelectedIds((prevIds) => {
      const index = prevIds.indexOf(id);
      // Remove from selected if unselected
      if (index > -1) {
        return prevIds.filter((i) => i !== id);
      }
      // Otherwise add it it's selected
      return [...prevIds, id];
    });
  }

  return (
    <li
      className={clsx(styles.label, selected && styles.selected)}
      onClick={handleClick}
    >
      {name}
    </li>
  );
}
