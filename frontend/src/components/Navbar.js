import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const handleClick = () => {
    logout();
  };
  return (
    <header>
      <div className="container">
        <h1>Slack Jazz 2025</h1>
        <img src={logo} alt="Logo" style={{ width: "100px", height: "auto" }} />
        <nav>
          {user && (
            <div>
              <Link to="/activity">Activity</Link>
              <Link to="/standings">Standings</Link>
              <Link to="/addPost">Add Post</Link>
              <Link to="/profile">Profile</Link>
              <span>{user.email}</span>
              <button onClick={handleClick}>Log out</button>
            </div>
          )}
          {!user && (
            <div>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign up</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
