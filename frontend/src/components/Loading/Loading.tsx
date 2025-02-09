import styles from "./Loading.module.css";

type LoadingProps = {
  text: string;
  bottomText?: string;
};

export default function Loading({ text, bottomText }: LoadingProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.text}>{text}</h1>
      <div className={styles.spinner}></div>
      {bottomText && <h2 className={styles.bottomText}>{bottomText}</h2>}
    </div>
  );
}
