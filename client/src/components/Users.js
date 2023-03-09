import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import useRefreshToken from "../hooks/useRefreshToken";

// Axios
// import axios from "../api/axios";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Users = () => {
  const [users, setUsers] = useState();
  const axiosPrivate = useAxiosPrivate();

  const refresh = useRefreshToken();
  // console.log("refresh:", refresh);

  // React Router Dom
  const navigate = useNavigate();
  const location = useLocation();

  // Load Users
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get("/users", {
          // allows the cancellation of the signal
          signal: controller.signal,
        });
        console.log("User Data we got back:", response.data);
        isMounted && setUsers(await response.data);
      } catch (err) {
        console.error("Get Users aborted", err);
        // navigate("/login", { state: { from: location }, replace: true });
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
            <li key={i}>{user?.user_name}</li>
          ))}
        </ul>
      ) : (
        <p>No users to display</p>
      )}
      <button
        onClick={() => {
          refresh();
        }}
      >
        Refresh
      </button>
    </article>
  );
};

export default Users;
