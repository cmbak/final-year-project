import { FormError as error } from "../../types";

type FormErrorProps = {
  error: string | error;
};

export default function FormError({ error }: FormErrorProps) {
  return <span className="form-error">{error}</span>;
}
