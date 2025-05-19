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
    };

    fetchStandings();
  }, [API_URL, user]);

  return (
    <div className="standings-page">
      {tournaments.map((t) => (
        <div key={t._id} className="tournament-table">
          <h3>{t.name}</h3>
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
              {t.teams.map((team, index) => (
                <tr key={index}>
                  <td>{team.name}</td>
                  <td>{team.wins}</td>
                  <td>{team.losses}</td>
                  <td>{team.averageScore}</td>
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
