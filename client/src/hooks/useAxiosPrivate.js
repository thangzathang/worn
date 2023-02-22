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
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    /* Response Interceptor */
    const responseIntercept = axiosPrivate.interceptors.response.use(
      // if the response is good, then return the response
      (response) => response,
      // error handler - if token has expired, this interceptor will handle
      async (error) => {
        const prevRequest = error?.config;
        // 403 - expired access token
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          // this will stop the endless loop
          prevRequest.sent = true;
          // Get new access token with the refresh hook.
          const newAccessToken = await refresh();
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
