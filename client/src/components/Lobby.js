import { Link } from "react-router-dom";

const Lobby = () => {
  return (
    <section>
      <h1>The Lobby</h1>
      <br />
      <p>Everyone is welcome here</p>
      <br />
      <br />
      <div className="flexGrow">
        <Link to="/">Go back to Home Page</Link>
      </div>
    </section>
  );
};

export default Lobby;
