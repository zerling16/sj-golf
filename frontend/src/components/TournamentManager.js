import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useJoinTournament } from "../hooks/useJoinTournament";

function TournamentManager() {
  const { user, dispatch } = useAuthContext();
  const API_URL = process.env.REACT_APP_API_URL;
  const { teamOptions, findTournamentTeams, joinTournament, loading, error } =
    useJoinTournament(API_URL, user);

  const [myTournaments, setMyTournaments] = useState([]);
  const [mode, setMode] = useState(""); // "", "join", "create"
  const [joinName, setJoinName] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");

  const [createData, setCreateData] = useState({
    name: "",
    teamName: "",
    numTeams: 0,
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
  });

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
            <li key={t._id}>
              <details>
                <summary>{t.name}</summary>
                <ul>
                  {t.teams && t.teams.length > 0 ? (
                    t.teams.map((team) => (
                      <li key={team._id}>
                        <strong>{team.teamName}</strong>
                        <ul>
                          {team.players && team.players.length > 0 ? (
                            team.players.map((player) => (
                              <li key={player._id}>
                                {player.name || player.email}
                              </li>
                            ))
                          ) : (
                            <li>No players yet</li>
                          )}
                        </ul>
                      </li>
                    ))
                  ) : (
                    <li>No teams found</li>
                  )}
                </ul>
              </details>
            </li>
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
          <button onClick={() => findTournamentTeams(joinName)}>
            Find Tournament
          </button>

          {teamOptions.length > 0 && (
            <select
              onChange={(e) => setSelectedTeamId(e.target.value)}
              value={selectedTeamId || ""}
            >
              <option value="">Select a Team</option>
              {teamOptions.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.teamName}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={async () => {
              const success = await joinTournament(joinName, selectedTeamId);
              if (success) {
                fetchTournaments();
                setMode("");
              }
            }}
          >
            Join
          </button>
          <button onClick={setMode}>Cancel</button>

          {loading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
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
            type="number"
            placeholder="Number of Teams"
            // value={createData.numTeams}
            onChange={(e) => {
              let numTeams = parseInt(e.target.value);
              if (isNaN(numTeams) || numTeams < 1) numTeams = 1;
              setCreateData({
                ...createData,
                numTeams,
                teamNames: Array(numTeams).fill(""),
              });
            }}
          />
          {createData.teamNames &&
            createData.teamNames.map((teamName, idx) => (
              <input
                key={idx}
                placeholder={`Team ${idx + 1} Name`}
                value={teamName}
                onChange={(e) => {
                  const updatedTeamNames = [...createData.teamNames];
                  updatedTeamNames[idx] = e.target.value;
                  setCreateData({ ...createData, teamNames: updatedTeamNames });
                }}
              />
            ))}
          <textarea
            placeholder="Description"
            value={createData.description}
            onChange={(e) =>
              setCreateData({ ...createData, description: e.target.value })
            }
          />
          <button onClick={handleCreate}>Submit</button>
          <button onClick={setMode}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default TournamentManager;
