import styles from "./YoutubeEmbed.module.css";

type YoutubeEmbedProps = {
  url: string;
};

export default function YoutubeEmbed({ url }: YoutubeEmbedProps) {
  return (
    <iframe
      className={styles.iframe}
      id="quizYoutubeEmbed"
      title="Quiz Youtube video embed"
      src={url}
      allow="picture-in-picture"
      allowFullScreen
    ></iframe>
  );
}
