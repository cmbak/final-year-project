import React, { useState } from "react";

export default function LabelSelect() {
  const [selectedLabels, setSelectedLabels] = useState([""]);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    // https://react.dev/reference/react-dom/components/select
    const options = [...e.target.selectedOptions]; // Actual option elements
    const values = options.map((option) => option.value); // Option strings
    setSelectedLabels(values);
  }

  return (
    <>
      <ul className="flex">
        {selectedLabels.map((label) => (
          <li key={label}>{label}</li>
        ))}
      </ul>
      <select name="labels" id="labels" multiple onChange={handleChange}>
        <option>test one</option>
        <option>test two</option>
      </select>
    </>
  );
}
