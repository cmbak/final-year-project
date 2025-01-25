import React from "react";
import styles from "./Modal.module.css";

type ModalProps = {
  children: React.JSX.Element;
  title: string;
  type: "normal" | "form";
  action?: (formData: FormData) => void;
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Modal({
  children,
  title,
  type,
  action,
  active,
  setActive,
}: ModalProps) {
  return (
    <>
      {active && (
        <>
          <div className={styles.modalBackground}></div>
          <div className={styles.modal}>
            <button
              className={styles.closeBtn}
              onClick={() => setActive(false)}
            >
              <i className="bi bi-x"></i>
            </button>
            <h2 className={styles.header}>{title}</h2>
            {/* If modal is for a form, main close button is inside form and of type submit */}
            {type === "form" ? (
              <div className={styles.content}>
                <form action={action}>
                  {children}
                  <button
                    type="submit"
                    className={`btn btn-secondary ${styles.mainBtn}`}
                  >
                    {title}
                  </button>
                </form>
              </div>
            ) : (
              <>
                <div className={styles.content}>{children}</div>
                <button
                  className={`btn btn-secondary ${styles.mainBtn}`}
                  onClick={() => setActive(false)}
                >
                  {title}
                </button>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
