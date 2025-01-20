import { Link } from "react-router";

export default function Navbar() {
  return (
    <nav>
      <p>Name</p>
      {/* Only want to show dashboard if logged in */}
      {/* Conditionally change text rendered and link of login */}
      <Link to="dashboard">Dashboard</Link>
      <Link to="login">Login</Link>
    </nav>
  );
}
