import Register from "./Register";
import Login from "./Login";

// Context
import { AuthProvider } from "./context/AuthProvider";

function App() {
  return (
    <main className="App">
      <AuthProvider>
        <Login />
      </AuthProvider>
    </main>
  );
}

export default App;
