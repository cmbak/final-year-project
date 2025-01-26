import CreateModal from "../CreateModal/CreateModal";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <CreateModal
        endpoint="/api/categories/"
        inputId="create-category-name"
        title="create category"
      />
    </div>
  );
}
