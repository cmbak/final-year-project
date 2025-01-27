import { useNavigate } from "react-router";
import styles from "./BackButton.module.css";

export default function BackButton() {
  let navigate = useNavigate();
  return (
    <button onClick={() => navigate(-1)} className={styles.back}>
      <i className="bi bi-arrow-left"></i>
    </button>
  );
}
