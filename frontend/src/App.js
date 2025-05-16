import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Standings from "./pages/Standings";
import Activity from "./pages/Activity";
import AddPost from "./pages/AddPost";

function App() {
  const { user } = useAuthContext();
  return (
    <div className="App">
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <BottomNav />
          <div className="pages">
            <Routes>
              <Route
                path="/"
                element={user ? <Home /> : <Navigate to="/login" />}
              ></Route>
              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/activity" />}
              ></Route>
              <Route
                path="/signup"
                element={!user ? <Signup /> : <Navigate to="/activity" />}
              ></Route>
              <Route
                path="/profile"
                element={user ? <Profile /> : <Navigate to="/login" />}
              ></Route>
              <Route
                path="/standings"
                element={user ? <Standings /> : <Navigate to="/login" />}
              ></Route>
              <Route
                path="/activity"
                element={user ? <Activity /> : <Navigate to="/login" />}
              ></Route>
              <Route
                path="/addPost"
                element={user ? <AddPost /> : <Navigate to="/login" />}
              ></Route>
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
