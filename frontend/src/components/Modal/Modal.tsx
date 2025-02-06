import React from "react";
import styles from "./Modal.module.css";
import { StateSetter } from "../../types";

type ModalProps = {
  children: React.JSX.Element;
  title: string;
  type: "normal" | "form";
  active: boolean;
  setActive: StateSetter<boolean>;
  action?: (formData: FormData) => void;
  isPending?: boolean;
};

export default function Modal({
  children,
  title,
  type,
  action,
  active,
  setActive,
  isPending,
}: ModalProps) {
  return (
    <>
      {active && (
        <>
          <div className={styles.modalBackground}></div>
          <div
            className={`${styles.modal} ${type === "form" && styles.form_modal}`}
          >
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
                <form action={action} className={styles.form}>
                  {children}
                  <button
                    type="submit"
                    className={`btn btn-secondary ${styles.mainBtn}`}
                    disabled={isPending}
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
