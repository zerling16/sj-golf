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

  const [editTeamName, setEditTeamName] = useState("");
  const [editTeamImage, setEditTeamImage] = useState(null);
  const [errors, setErrors] = useState("");
  const [editingTeamId, setEditingTeamId] = useState(null);
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
  }, []);

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

  const handleTeamUpdate = async (e, teamId, tIndex, teamIndex) => {
    e.preventDefault();

    if (!user) {
      setErrors("You must be logged in");
      return;
    }

    let base64 = null;
    if (editTeamImage) {
      base64 = await toBase64(editTeamImage);
    }

    const updateBody = {
      teamId,
      teamName: editTeamName,
    };
    if (base64) {
      updateBody.image = base64;
    }

    try {
      const response = await fetch(`${API_URL}/tournament/update/${teamId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(updateBody),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(data.error || "Update failed");
      } else {
        setErrors("");
        setEditTeamName("");
        setEditTeamImage(null);
        setEditingTeamId(null);
        setMyTournaments((prev) => {
          const updated = [...prev];
          updated[tIndex].teams[teamIndex] = {
            ...updated[tIndex].teams[teamIndex],
            teamName: data.teamName,
            teamImageUrl:
              data.teamImageUrl ||
              updated[tIndex].teams[teamIndex].teamImageUrl,
          };
          return updated;
        });
      }
    } catch (err) {
      console.error("Update error:", err);
      setErrors("Something went wrong.");
    }
  };

  return (
    <div className="tournament-manager">
      <h3>My Tournaments</h3>
      {myTournaments.length > 0 ? (
        <ul>
          {myTournaments.map((tournament, tIndex) => (
            <li key={tournament._id}>
              <details>
                <summary>{tournament.name}</summary>
                <ul>
                  {tournament.teams && tournament.teams.length > 0 ? (
                    tournament.teams.map((team, teamIndex) => {
                      const isUserTeam = team.players.some(
                        (player) => player._id === user._id
                      );

                      return (
                        <li
                          key={team._id}
                          style={{
                            backgroundColor: isUserTeam
                              ? "#ffff9e"
                              : "transparent",
                            borderRadius: "6px",
                            padding: "8px",
                            marginBottom: "4px",
                          }}
                        >
                          {team.teamImageUrl && (
                            <img
                              src={team.teamImageUrl}
                              alt={`${team.teamName} logo`}
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                marginRight: "8px",
                              }}
                            />
                          )}

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

                          {isUserTeam && (
                            <div style={{ marginTop: "8px" }}>
                              {editingTeamId === team._id ? (
                                <form
                                  onSubmit={(e) =>
                                    handleTeamUpdate(
                                      e,
                                      team._id,
                                      tIndex,
                                      teamIndex
                                    )
                                  }
                                >
                                  <input
                                    type="text"
                                    value={editTeamName}
                                    onChange={(e) =>
                                      setEditTeamName(e.target.value)
                                    }
                                    placeholder="Edit Team Name"
                                  />
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                      setEditTeamImage(e.target.files[0])
                                    }
                                  />
                                  <button type="submit">Save Changes</button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingTeamId(null)}
                                  >
                                    Cancel
                                  </button>
                                </form>
                              ) : (
                                <button
                                  onClick={() => {
                                    setEditingTeamId(team._id);
                                    setEditTeamName(team.teamName); // preload current name
                                    setEditTeamImage(null);
                                  }}
                                >
                                  Edit
                                </button>
                              )}
                              {error && editingTeamId === team._id && (
                                <p style={{ color: "red" }}>{error}</p>
                              )}
                            </div>
                          )}
                        </li>
                      );
                    })
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

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
}

export default TournamentManager;
