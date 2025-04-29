import { useRef } from "react";

type VideoProps = {
  name: string;
  timestamp: number;
};

export default function Video({ name, timestamp }: VideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  if (videoRef.current !== null) {
    videoRef.current.currentTime = timestamp;
  }

  return (
    <video controls width="100%" height="100%" ref={videoRef}>
      <source src={name} type="video/mp4" />
    </video>
  );
}
