import { useActionState, useState } from "react";
import { instance } from "../../axiosConfig";
import Modal from "../Modal/Modal";
import { fetchUser } from "../../utils/fetchUser";
import { useQuery } from "@tanstack/react-query";

// Modal which sends POST request to endpoint
// With name entered in form and id of current user

type CreateModalProps = {
  endpoint: string;
  inputId: string;
  title: string;
};

export default function CreateModal({
  endpoint,
  inputId,
  title,
}: CreateModalProps) {
  const [modalActive, setModalActive] = useState(false);
  const [state, formAction, isPending] = useActionState(createInstance, null);
  const { data } = useQuery({ queryKey: ["user"], queryFn: fetchUser });

  async function createInstance(prevState: unknown, formData: FormData) {
    const name = formData.get("name") as string; // Stop input default value warning type mismatch

    try {
      await instance.post(
        endpoint,
        { name, user: data.id },
        { withXSRFToken: true },
      );
      setModalActive(false);
      return { name };
    } catch (error: any) {
      if (
        error.response !== undefined &&
        error.response.data.errors !== undefined // How django will return form errors
      ) {
        return { name, error: error.response.data.errors?.name };
      } else {
        alert(error); // Debug purposes
      }
    }
  }

  return (
    <>
      <button
        className="btn btn-secondary"
        onClick={() => setModalActive(true)}
        type="button"
      >
        {title}
      </button>

      <Modal
        title={title}
        type="form"
        action={formAction}
        active={modalActive}
        setActive={setModalActive}
        isPending={isPending}
      >
        <div className="form-item">
          <label htmlFor={inputId}>name</label>
          {state?.error && <span className="form-error">{state.error}</span>}
          <input
            defaultValue={
              state?.name
            } /* Old/Invalid name stays on form after error */
            name="name"
            id={inputId}
            maxLength={30}
            required
          />
        </div>
      </Modal>
    </>
  );
}
