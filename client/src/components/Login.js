import React, { useRef, useState, useEffect } from "react";

// React-router-dom
import { Link, useNavigate, useLocation } from "react-router-dom";

// Auth hook
import useAuth from "../hooks/useAuth";

// Axios
import axios from "../api/axios";

const LOGIN_URL = "/auth/login";

const Login = () => {
  // Context
  const { setAuth } = useAuth();

  // Handle re-route when logging in.
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // Ref
  const userRef = useRef();
  const errRef = useRef();

  // State
  const [userEmail, setUserEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  // Auto Focus on the user email field
  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [userEmail, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(LOGIN_URL, JSON.stringify({ email: userEmail, password: pwd }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        // Needed for JWT tokens.
      });

      console.log("Response from Backend:", response);
      //console.log(JSON.stringify(response));

      const accessToken = response?.data?.accessToken;
      console.log("Access Token:", accessToken);

      // We just need the values.
      const roles = Object.values(response?.data?.roles);
      console.log("User roles:", roles);
      setAuth({ userEmail, pwd, roles: roles, accessToken });

      setUserEmail("");
      setPwd("");

      // Great trick to Navigate back to user's original page.
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <section>
      <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
        {errMsg}
      </p>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="useremail">Email:</label>
        <input
          //
          type="text"
          id="email"
          ref={userRef}
          autoComplete="off"
          onChange={(e) => setUserEmail(e.target.value)}
          value={userEmail}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          //
          type="password"
          id="password"
          onChange={(e) => setPwd(e.target.value)}
          value={pwd}
          required
        />
        <button>Sign In</button>
      </form>
      <p>
        Need an Account?
        <br />
        <span className="line">
          {/*put router link here*/}
          <a href="#">Sign Up</a>
        </span>
      </p>
    </section>
  );
};

export default Login;
