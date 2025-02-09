import clsx from "clsx";
import { Label as LabelType, StateSetter } from "../../types";
import { useState } from "react";
import styles from "./Label.module.css";

type LabelProps = {
  setSelectedIds: StateSetter<number[]>;
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

  // Replace whitespace in string with underscore for correct html label
  function stringToId(str: string) {
    return str.replace(/\s/g, "_");
  }

  return (
    <>
      <input
        type="checkbox"
        name={name}
        id={stringToId(name)}
        className={clsx(styles.label, selected && styles.selected)}
        onClick={handleClick}
        value={id}
      />
      <label htmlFor={stringToId(name)}>{name}</label>
    </>
  );
}
