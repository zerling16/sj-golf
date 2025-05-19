import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import TournamentManager from "../components/TournamentManager";

function ProfilePage() {
  const { user, dispatch } = useAuthContext();
  const API_URL = process.env.REACT_APP_API_URL;

  const [profileData, setProfileData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [handicap, setHandicap] = useState(0);
  const [file, setFile] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/user/get`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setProfileData(data);
          setName(data.name);
          setHandicap(data.handicap);
          setFile(data.image);
        } else {
          setError(data.error || "Failed to load profile");
        }
      } catch {
        setError("Network error");
      }
    };

    fetchProfile();
  }, [API_URL, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    let base64 = null;

    if (file) {
      base64 = await toBase64(file);
    }

    const updateBody = {
      name,
      handicap,
    };
    if (base64) {
      updateBody.image = base64;
    }

    const response = await fetch(`${API_URL}/user/updateUser`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(updateBody),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Update failed");
    } else {
      const updatedUser = { ...user, ...data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      dispatch({ type: "LOGIN", payload: updatedUser });
      setProfileData(data);
      setEditMode(false);
      setError("");
    }
  };

  if (!profileData) return <p>Loading profile...</p>;

  return (
    <div className="wrapper">
      <div className="tournament-manager">
        <h2>My Profile</h2>

        {error && <div className="error">{error}</div>}

        {!editMode ? (
          <>
            <p>
              <strong>Name:</strong> {profileData.name}
            </p>
            <p>
              <strong>Handicap:</strong> {profileData.handicap}
            </p>
            <img src={profileData.profileImageUrl} alt="Profile" width="150" />
            <br />
            <button onClick={() => setEditMode(true)}>Edit Profile</button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>Name:</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />

            <label>Handicap:</label>
            <input
              type="number"
              value={handicap}
              onChange={(e) => setHandicap(Number(e.target.value))}
            />

            <label>Profile Picture:</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />

            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditMode(false)}>
              Cancel
            </button>
          </form>
        )}
      </div>
      <TournamentManager />
    </div>
  );
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
}

export default ProfilePage;
