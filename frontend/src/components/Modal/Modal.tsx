import React, { useState } from "react";

type ModalProps = {
  children: React.JSX.Element;
  openBtnText: string;
  header: string;
};

export default function Modal({ children, openBtnText, header }: ModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen((prev) => !prev)}>{openBtnText}</button>
      {isOpen && <h2>{header}</h2>}
    </>
  );
}
