import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { FiActivity, FiPlusCircle, FiUser } from "react-icons/fi";
import { FaTrophy } from "react-icons/fa";

const BottomNav = () => {
  const { user } = useAuthContext();

  if (!user) return null; // Hide nav if not logged in

  return (
    <nav className="bottom-nav">
      <Link to="/activity">
        <FiActivity size={24} />
      </Link>
      <Link to="/standings">
        <FaTrophy size={24} />
      </Link>
      <Link to="/addPost">
        <FiPlusCircle size={24} />
      </Link>
      <Link to="/profile">
        <FiUser size={24} />
      </Link>
    </nav>
  );
};

export default BottomNav;
