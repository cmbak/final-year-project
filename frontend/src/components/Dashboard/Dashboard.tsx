import Modal from "../Modal/Modal";

export default function Dashboard() {
  return (
    <div>
      Dashboard
      <Modal header="modal" openBtnText="open modal">
        <p>This is inside the modal</p>
      </Modal>
    </div>
  );
}
