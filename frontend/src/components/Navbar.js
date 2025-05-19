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
        {/* <h1>Slack Jazz</h1> */}
        <img src={logo} alt="Logo" style={{ width: "100px", height: "auto" }} />
        <nav>
          {user && (
            <div>
              <span>{user.name || user.email}</span>
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

//     <header className="top-navbar">
//       <div className="container">
//         <img src={logo} alt="Logo" style={{ width: "100px", height: "auto" }} />
//         <h1>Slack Jazz 2025</h1>
//         <nav>
//           {user && (
//             <div className="nav-content">
//               <span>{user.email}</span>
//               <button onClick={handleClick}>Log out</button>
//             </div>
//           )}
//           {!user && (
//             <div className="nav-content">
//               <Link to="/login">Login</Link>
//               <Link to="/signup">Sign up</Link>
//             </div>
//           )}
//         </nav>
//       </div>
//     </header>
//   );
// };

export default Navbar;
