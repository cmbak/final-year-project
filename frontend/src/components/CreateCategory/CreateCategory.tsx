import { instance } from "../../axiosConfig";
import Modal from "../Modal/Modal";

export default function CreateCategory() {
  function createCategory(formData: FormData) {
    instance.post(
      "/api/category/",
      { name: formData.get("name") },
      { withXSRFToken: true },
    );

    // Close modal
  }

  return (
    <Modal title="create category" type="form" action={createCategory}>
      <div className="form-item">
        <label htmlFor="create-category-name">name</label>
        <input name="name" id="create-category-name" required />
      </div>
    </Modal>
  );
}
