import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

function AddPost() {
  const { user } = useAuthContext();
  const [myTournaments, setMyTournaments] = useState([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState("");
  const [tournamentName, setTournamentName] = useState("");
  const [availableTeams, setAvailableTeams] = useState([]);
  const [teamOne, setTeamOne] = useState("");
  const [teamOneName, setTeamOneName] = useState("");
  const [teamTwo, setTeamTwo] = useState("");
  const [teamTwoName, setTeamTwoName] = useState("");
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const fetchTournaments = async () => {
    const res = await fetch(`${API_URL}/tournament/get`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const data = await res.json();
    if (res.ok) setMyTournaments(data);
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    if (!file) {
      setError("Please select an image");
      return;
    }

    const base64 = await toBase64(file);

    const response = await fetch(`${API_URL}/post/newPost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        tournamentId: selectedTournamentId,
        tournamentName,
        teamOne,
        teamOneName,
        teamTwo,
        teamTwoName,
        score1,
        score2,
        description,
        image: base64,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Post submission failed");
    } else {
      setError("");
      console.log("Post created:", data);
      setSelectedTournamentId("");
      setTournamentName("");
      setTeamOne("");
      setTeamOneName("");
      setTeamTwo("");
      setTeamTwoName("");
      setScore1(0);
      setScore2(0);
      setDescription("");
      setFile(null);
      navigate("/activity");
    }
  };

  const getTeams = async (tournamentId) => {
    const selectedTournament = myTournaments.find(
      (t) => t._id === tournamentId
    );
    setAvailableTeams(selectedTournament?.teams || []);
    setTournamentName(selectedTournament.name);
    setTeamOne("");
    setTeamTwo("");
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit} className="create">
        <h3>Add Match Post</h3>

        <label>Tournament:</label>
        <select
          value={selectedTournamentId}
          onChange={(e) => {
            setSelectedTournamentId(e.target.value);
            getTeams(e.target.value);
          }}
        >
          <option value="">Select Tournament</option>
          {myTournaments.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>

        <label>Team One:</label>
        <select
          value={teamOne}
          onChange={(e) => {
            const selectedId = e.target.value;
            setTeamOne(selectedId);
            const selectedTeam = availableTeams.find(
              (team) => team._id === selectedId
            );
            setTeamOneName(selectedTeam?.teamName || "");
          }}
          disabled={!selectedTournamentId}
        >
          <option value="">Select Team One</option>
          {availableTeams.map((team) => (
            <option key={team._id} value={team._id}>
              {team.teamName}
            </option>
          ))}
        </select>

        <label>Team Two:</label>
        <select
          value={teamTwo}
          onChange={(e) => {
            const selectedId = e.target.value;
            setTeamTwo(selectedId);
            const selectedTeam = availableTeams.find(
              (team) => team._id === selectedId
            );
            setTeamTwoName(selectedTeam?.teamName || "");
          }}
          disabled={!selectedTournamentId}
        >
          <option value="">Select Team Two</option>
          {availableTeams.map((team) => (
            <option key={team._id} value={team._id}>
              {team.teamName}
            </option>
          ))}
        </select>

        <label>Score 1</label>
        <input value={score1} onChange={(e) => setScore1(e.target.value)} />

        <label>Score 2</label>
        <input value={score2} onChange={(e) => setScore2(e.target.value)} />

        <label>Match Description:</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Upload Image:</label>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />

        <button type="submit">Submit Post</button>

        {error && <div className="error">{error}</div>}
      </form>
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

export default AddPost;
