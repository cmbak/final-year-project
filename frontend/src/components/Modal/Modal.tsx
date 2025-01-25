import React, { useState } from "react";

type ModalProps = {
  children: React.JSX.Element;
  title: string;
  onClick: () => void;
};

export default function Modal({ children, title, onClick }: ModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>{title}</button>
      {isOpen && (
        <div>
          <h2>{title}</h2>
          <div>{children}</div>
          <button
            onClick={() => {
              onClick();
              setIsOpen(false);
            }}
          >
            {title}
          </button>
        </div>
      )}
    </>
  );
}
