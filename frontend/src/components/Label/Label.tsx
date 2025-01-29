import clsx from "clsx";
import { Label as LabelType } from "../../types";
import { useState } from "react";
import styles from "./Label.module.css";

type LabelProps = Omit<LabelType, "user">;

export default function Label({ id, name }: LabelProps) {
  const [selected, setSelected] = useState(false);
  return (
    <li
      className={clsx(styles.label, selected && styles.selected)}
      onClick={() => setSelected((prevSelected) => !prevSelected)}
    >
      {name}
    </li>
  );
}
