import { instance } from "../../axiosConfig";
import Modal from "../Modal/Modal";

export default function CreateCategory() {
  async function createCategory(formData: FormData) {
    await instance.post(
      "/api/category/",
      { name: formData.get("name") },
      { withXSRFToken: true },
    );
  }

  return (
    <Modal title="create category" onClick={() => console.log("clicked")}>
      <form action={createCategory}>
        <div className="form-item">
          <label htmlFor="name">name</label>
          <input name="name" required />
        </div>
      </form>
    </Modal>
  );
}
