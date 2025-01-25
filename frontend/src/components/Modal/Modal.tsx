import React, { useState } from "react";
import styles from "./Modal.module.css";

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
        <>
          <div className={styles.modalBackground}></div>
          <div className={styles.modal}>
            <button
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
            >
              <i className="bi bi-x"></i>
            </button>
            <h2 className={styles.header}>{title}</h2>
            <div className={styles.content}>{children}</div>
            <button
              onClick={() => {
                onClick();
                setIsOpen(false);
              }}
            >
              {title}
            </button>
          </div>
        </>
      )}
    </>
  );
}
