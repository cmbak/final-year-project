import { useState } from "react";
import { instance } from "../../axiosConfig";
import Modal from "../Modal/Modal";

export default function CreateCategory() {
  const [modalActive, setModalActive] = useState(false);

  function createCategory(formData: FormData) {
    instance.post(
      "/api/category/",
      { name: formData.get("name") },
      { withXSRFToken: true },
    );

    setModalActive(false);
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
        action={createCategory}
        active={modalActive}
        setActive={setModalActive}
      >
        <div className="form-item">
          <label htmlFor="create-category-name">name</label>
          <input name="name" id="create-category-name" required />
        </div>
      </Modal>
    </>
  );
}
