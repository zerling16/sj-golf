import { useState } from "react";

export const useJoinTournament = (API_URL, user) => {
  const [teamOptions, setTeamOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const findTournamentTeams = async (tournamentName) => {
    setLoading(true);
    setError("");
    console.log("Fetching tournament teams for:", tournamentName);
    const res = await fetch(`${API_URL}/tournament/find/${tournamentName}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const data = await res.json();
    console.log("Response:", data);
    if (res.ok) {
      setTeamOptions(data.teams);
    } else {
      setError(data.error || "Tournament not found");
    }
    setLoading(false);
  };

  const joinTournament = async (tournamentName, teamId) => {
    setLoading(true);
    setError("");
    const res = await fetch(`${API_URL}/tournament/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ name: tournamentName, teamId }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Failed to join tournament");
    }
    return res.ok;
  };

  return { teamOptions, findTournamentTeams, joinTournament, loading, error };
};
