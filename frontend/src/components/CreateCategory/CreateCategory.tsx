import { useActionState, useState } from "react";
import { instance } from "../../axiosConfig";
import Modal from "../Modal/Modal";
import { fetchUser } from "../../utils/fetchUser";
import { useQuery } from "@tanstack/react-query";

export default function CreateCategory() {
  const [modalActive, setModalActive] = useState(false);
  const [state, formAction, isPending] = useActionState(createCategory, null);
  const { data } = useQuery({ queryKey: ["user"], queryFn: fetchUser });

  function createCategory(prevState: unknown, formData: FormData) {
    const name = formData.get("name");
    instance
      .post(
        "/api/categories/",
        { name, user: data.id },
        { withXSRFToken: true },
      )
      .then((response) => {
        console.log(response);
        setModalActive(false);
        return name;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  }

  return (
    <>
      <button
        className="btn btn-secondary"
        onClick={() => setModalActive(true)}
        type="button"
      >
        create category
      </button>
      <Modal
        title="create category"
        type="form"
        action={formAction}
        active={modalActive}
        setActive={setModalActive}
        isPending={isPending}
      >
        <div className="form-item">
          <label htmlFor="create-category-name">name</label>
          <input name="name" id="create-category-name" required />
        </div>
      </Modal>
    </>
  );
}
