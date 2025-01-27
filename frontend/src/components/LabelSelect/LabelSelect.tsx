import React, { useRef, useState } from "react";
import styles from "./LabelSelect.module.css";

export default function LabelSelect() {
  const [selectedLabels, setSelectedLabels] = useState([""]);
  const selectedRef = useRef<HTMLSelectElement>(null); // TODO type

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    // Add selected label to list
    // https://react.dev/reference/react-dom/components/select
    const options = [...e.target.selectedOptions]; // Actual option elements
    const values = options.map((option) => option.value); // Option strings
    setSelectedLabels(values);
  }

  function handleClick(label: string) {
    // Remove clicked label from list
    setSelectedLabels((prevSelectedLabels) =>
      prevSelectedLabels.filter((l) => l !== label),
    );
    console.log(selectedRef.current?.selectedOptions);
    // TODO ^ returns HTML collection of option see mdn
    // TODO how to edit selected options?
  }

  return (
    <>
      <ul className={`flex ${styles.labelList}`}>
        {selectedLabels.map((label) => (
          <li
            key={label}
            className={styles.label}
            onClick={() => handleClick(label)}
          >
            {label}
          </li>
        ))}
      </ul>
      <select
        name="labels"
        id="labels"
        multiple
        onChange={handleChange}
        ref={selectedRef}
      >
        <option>test one</option>
        <option>test two</option>
        <option>test three</option>
        <option>test four</option>
      </select>
    </>
  );
}
