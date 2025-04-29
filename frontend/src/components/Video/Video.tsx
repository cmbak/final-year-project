import { useEffect, useRef } from "react";
import { StateSetter } from "../../types";

type VideoProps = {
  name: string;
  timestamp: number;
  showCorrect: boolean;
  timestampClicked: boolean;
  setTimestampClicked: StateSetter<boolean>;
};

export default function Video({
  name,
  timestamp,
  showCorrect,
  timestampClicked,
  setTimestampClicked,
}: VideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // In use effect so can set state of timestampClicked AFTER timestamp has been clicked changed in Question (i.e. when new value of timestamp set)
  useEffect(() => {
    if (videoRef.current !== null && showCorrect && timestampClicked) {
      videoRef.current.currentTime = timestamp;
      videoRef.current.scrollIntoView({ behavior: "smooth" });
      videoRef.current.play();
      // So that video timestamp can be changed again
      setTimestampClicked(false);
    }
  }, [timestamp, showCorrect]);

  return (
    <video controls width="100%" height="100%" ref={videoRef}>
      <source src={name} type="video/mp4" />
    </video>
  );
}
