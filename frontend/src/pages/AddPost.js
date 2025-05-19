import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

function AddPost() {
  const { user } = useAuthContext();
  const [teamOne, setTeamOne] = useState("");
  const [teamTwo, setTeamTwo] = useState("");
  const [score, setScore] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

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

    const response = await fetch(`${API_URL}/image/newPost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        teamOne,
        teamTwo,
        score,
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
      // Optionally reset the form
      setTeamOne("");
      setTeamTwo("");
      setScore("");
      setDescription("");
      setFile(null);
      navigate("/activity");
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit} className="create">
        <h3>Add Match Post</h3>

        <label>Team One:</label>
        <input value={teamOne} onChange={(e) => setTeamOne(e.target.value)} />

        <label>Team Two:</label>
        <input value={teamTwo} onChange={(e) => setTeamTwo(e.target.value)} />

        <label>Final Score:</label>
        <input value={score} onChange={(e) => setScore(e.target.value)} />

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
