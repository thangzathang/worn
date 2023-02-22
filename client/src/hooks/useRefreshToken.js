import React, { useEffect } from "react";

// Context
import useAuth from "./useAuth";

// axios
import axios from "../api/axios";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    // Backend get
    const response = await axios.get("/refresh", {
      withCredentials: true,
    });

    // We will get back new access token.
    setAuth((prev) => {
      console.log(JSON.stringify(prev));
      console.log(response.data.accessToken);
      return { ...prev, accessToken: response.data.accessToken };
    });
    return response.data.accessToken;
  };

  // return the access token.
  return refresh;
};

export default useRefreshToken;
