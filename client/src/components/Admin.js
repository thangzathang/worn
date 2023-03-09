import { Link } from "react-router-dom";
import Users from "./Users";

const Admin = () => {
  return (
    <section>
      <h1>Admins Page</h1>
      <br />
      <p>You are an Admin. You can see this message.</p>
      <div className="flexGrow">
        <Link to="/">Home</Link>

        <br />
        <Users />
        <br />
      </div>
    </section>
  );
};

export default Admin;
