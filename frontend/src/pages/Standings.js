import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const StandingsPage = () => {
  const { user } = useAuthContext();
  const [tournaments, setTournaments] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchStandings = async () => {
      const response = await fetch(`${API_URL}/tournament/standings`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await response.json();
      if (response.ok) setTournaments(data);
      console.log(data);
    };

    fetchStandings();
  }, [API_URL, user]);

  return (
    <div className="standings-page">
      {tournaments.map((tournament) => (
        <div key={tournament.tournamentId} className="tournament-table">
          <h3>{tournament.tournamentName}</h3>
          <table>
            <thead>
              <tr>
                <th>Team</th>
                <th>Wins</th>
                <th>Losses</th>
                <th>Avg. Score</th>
              </tr>
            </thead>
            <tbody>
              {tournament.standings.map((team) => (
                <tr key={team.teamId}>
                  <td>{team.teamName}</td>
                  <td>{team.wins}</td>
                  <td>{team.losses}</td>
                  <td>{team.averageScore || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default StandingsPage;
