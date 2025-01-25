import Modal from "../Modal/Modal";

export default function Dashboard() {
  return (
    <div>
      Dashboard
      <Modal title="create category" onClick={() => console.log("clicked")}>
        <p>category name</p>
      </Modal>
    </div>
  );
}
