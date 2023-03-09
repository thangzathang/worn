import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    /* Request Interceptor */
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          // Now add the authorization headers
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
          // You should be able to see the newly added Authorization Bearer Token
          // console.log("Config headers:", config.headers);
        }
        return config;
      },
      (error) => {
        console.log("error interceptors.request:", error);
        Promise.reject(error);
      }
    );

    /* Response Interceptor */

    const responseIntercept = axiosPrivate.interceptors.response.use(
      // if the response is good, then return the response
      (response) => {
        return response;
      },
      // (response) => response,
      // error handler - if token has expired, this interceptor will handle
      async (error) => {
        const prevRequest = error?.config;

        if (error?.response?.status === 403 && !prevRequest?.sent) {
          // console.log("Called here in error?.response?");
          // this will stop the endless loop
          prevRequest.sent = true;
          // Get new access token with the refresh hook.
          const newAccessToken = await refresh();
          // console.log("newAccessToken:", newAccessToken);
          // Set the headers Authorization
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    // Clean up function
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  /* 
  We are returning the axiosPrivate,
  but by the end of the function, 
  it would have attached the interceptors to the axiosPrivate instance.
  */

  return axiosPrivate;
};

export default useAxiosPrivate;
