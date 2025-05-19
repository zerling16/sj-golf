import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { FiActivity, FiPlusCircle, FiUser } from "react-icons/fi";
import { FaTrophy } from "react-icons/fa";

const BottomNav = () => {
  const { user } = useAuthContext();
  const location = useLocation();

  if (!user) return null;

  if (!user?.tournamentId || user.tournamentId == "") {
    console.log("hello:  ");
    console.log(user);
    return null;
  }

  return (
    <nav className="bottom-nav">
      <Link
        to="/activity"
        className={location.pathname === "/activity" ? "active" : ""}
      >
        <FiActivity size={24} />
      </Link>
      <Link
        to="/standings"
        className={location.pathname === "/standings" ? "active" : ""}
      >
        <FaTrophy size={24} />
      </Link>
      <Link
        to="/addPost"
        className={location.pathname === "/addPost" ? "active" : ""}
      >
        <FiPlusCircle size={24} />
      </Link>
      <Link
        to="/profile"
        className={location.pathname === "/profile" ? "active" : ""}
      >
        <FiUser size={24} />
      </Link>
    </nav>
  );
};

export default BottomNav;
