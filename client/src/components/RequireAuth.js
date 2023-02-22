import { useLocation, Navigate, Outlet } from "react-router-dom";
// Auth Hook
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();

  // console.log("Roles Needed:", allowedRoles);
  // console.log("Your Role:", auth?.roles);

  const location = useLocation();

  // let rolesFind = auth.roles;
  // rolesFind.find((role) => {
  //   return allowedRoles?.includes(role) ? <Outlet /> : auth?.user ? <Navigate to="/unauthorized" state={{ from: location }} replace /> : <Navigate to="/login" state={{ from: location }} replace />;
  // });

  return auth?.roles?.find((role) =>
    //
    allowedRoles?.includes(role)
  ) ? (
    <Outlet />
  ) : auth?.userEmail ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    // if userEmail not in auth context, then we set state.
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
