type VideoProps = {
  name: string;
};

export default function Video({ name }: VideoProps) {
  return (
    <video controls width="100%" height="100%">
      <source src={name} type="video/mp4" />
    </video>
  );
}
