import { Label as LabelType } from "../../types";

type LabelProps = {
  className: string;
} & Omit<LabelType, "user">;

export default function Label({ id, name, className }: LabelProps) {
  return <li className={className}>{name}</li>;
}
