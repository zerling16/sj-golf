import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

function TournamentManager() {
  const { user, dispatch } = useAuthContext();
  const API_URL = process.env.REACT_APP_API_URL;

  const [myTournaments, setMyTournaments] = useState([]);
  const [mode, setMode] = useState(""); // "", "join", "create"
  const [joinName, setJoinName] = useState("");

  const [createData, setCreateData] = useState({
    name: "",
    teamName: "",
    numTeams: 4,
    description: "",
  });

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

  const handleJoin = async () => {
    const res = await fetch(`${API_URL}/tournament/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ name: joinName }),
    });
    const data = await res.json();
    if (res.ok) {
      const updatedUser = {
        ...user,
        tournamentId: [...(user.tournamentId || []), data._id],
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      dispatch({ type: "LOGIN", payload: updatedUser });
      fetchTournaments();
      setMode("");
    }
  };

  const handleCreate = async () => {
    const res = await fetch(`${API_URL}/tournament/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(createData),
    });
    const data = await res.json();
    if (res.ok) {
      console.log("Res:");
      console.log(res);
      console.log("Data:");
      console.log(data);
      const updatedUser = {
        ...user,
        tournamentId: [...(user.tournamentId || []), data._id],
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      dispatch({ type: "LOGIN", payload: updatedUser });
      fetchTournaments();
      setMode("");
    }
  };

  return (
    <div className="tournament-manager">
      <h3>My Tournaments</h3>
      {myTournaments.length > 0 ? (
        <ul>
          {myTournaments.map((t) => (
            <li key={t._id}>{t.name}</li>
          ))}
        </ul>
      ) : (
        <p>No Tournaments Joined</p>
      )}

      <div style={{ marginTop: "16px" }}>
        <button onClick={() => setMode("join")}>Join</button>
        <button onClick={() => setMode("create")}>Create</button>
      </div>

      {mode === "join" && (
        <div style={{ marginTop: "12px" }}>
          <input
            placeholder="Tournament name"
            value={joinName}
            onChange={(e) => setJoinName(e.target.value)}
          />
          <button onClick={handleJoin}>Submit</button>
        </div>
      )}

      {mode === "create" && (
        <div style={{ marginTop: "12px" }}>
          <input
            placeholder="Tournament Name"
            value={createData.name}
            onChange={(e) =>
              setCreateData({ ...createData, name: e.target.value })
            }
          />
          <input
            placeholder="Team Name"
            value={createData.teamName}
            onChange={(e) =>
              setCreateData({ ...createData, teamName: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Number of Teams"
            value={createData.numTeams}
            onChange={(e) =>
              setCreateData({
                ...createData,
                numTeams: parseInt(e.target.value),
              })
            }
          />
          <textarea
            placeholder="Description"
            value={createData.description}
            onChange={(e) =>
              setCreateData({ ...createData, description: e.target.value })
            }
          />
          <button onClick={handleCreate}>Submit</button>
        </div>
      )}
    </div>
  );
}

export default TournamentManager;
