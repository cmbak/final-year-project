import { Link } from "react-router";

export default function Navbar() {
  return (
    <nav>
      <Link to="/">Name</Link>
      <Link to="dashboard">Dashboard</Link>
      <Link to="login">Login</Link>
    </nav>
  );
}
