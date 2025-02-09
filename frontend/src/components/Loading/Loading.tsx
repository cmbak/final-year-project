import styles from "./Loading.module.css";

type LoadingProps = {
  text: string;
};

export default function Loading({ text }: LoadingProps) {
  return (
    <div>
      <h1>{text}</h1>
      <div className={styles.spinner}></div>
    </div>
  );
}
