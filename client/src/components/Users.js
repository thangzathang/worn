import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Axios
import axios from "../api/axios";
// import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Users = () => {
  const [users, setUsers] = useState();
  // const axiosPrivate = useAxiosPrivate();

  // React Router Dom
  const navigate = useNavigate();
  const location = useLocation();

  // Load Users
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        // const response = await axiosPrivate.get("/users", {
        //   // allows the cancellation of the signal
        //   signal: controller.signal,
        // });
        // console.log(response.data);
        // isMounted && setUsers(response.data);
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getUsers();

    // Clean up function
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <article>
      <h2>Users List</h2>
      {users?.length ? (
        <ul>
          {users.map((user, i) => (
            <li key={i}>{user?.username}</li>
          ))}
        </ul>
      ) : (
        <p>No users to display</p>
      )}
    </article>
  );
};

export default Users;
