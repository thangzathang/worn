// All Pages
import Admin from "./components/Admin";
import Home from "./components/Home";
import LinkPage from "./components/LinkPage";
import Lounge from "./components/Lounge";
import Layout from "./components/Layout";
import Editor from "./components/Editor";
import Unauthorized from "./components/Unauthorized";
import Missing from "./components/Missing";
import Register from "./components/Register";
import Login from "./components/Login";
import Lobby from "./components/Lobby";
import PersistLogin from "./components/PersistLogin";

// react-router-dom
import RequireAuth from "./components/RequireAuth";
import { Routes, Route } from "react-router-dom";

// Defined Roles
const ROLES = {
  User: 2001,
  Editor: 1984,
  Admin: 5150,
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="linkpage" element={<LinkPage />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* Persisted Routes */}
        <Route element={<PersistLogin />}>
          {/* Protected */}
          <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
            <Route path="" element={<Home />} />
            <Route path="lobby" element={<Lobby />} />
            <Route path="admin" element={<Admin />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.Editor]} />}>
            <Route path="editor" element={<Editor />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>{/* <Route path="admin" element={<Admin />} /> */}</Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin]} />}>
            <Route path="lounge" element={<Lounge />} />
          </Route>
        </Route>

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
