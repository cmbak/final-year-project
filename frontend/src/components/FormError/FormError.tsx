// TODO does this need to be a separate component
type FormErrorProps = {
  error: string;
};

export default function FormError({ error }: FormErrorProps) {
  return <span className="form-error">{error}</span>;
}
