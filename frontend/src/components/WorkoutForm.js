import { useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";

function ImageUploader({ userId }) {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const base64 = await toBase64(file);
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/image/upload`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, userId }),
      }
    );
    const data = await response.json();
    console.log("Uploaded URL:", data.url);
  };
}

const WorkoutForm = ({ workout }) => {
  const { dispatch } = useWorkoutsContext();
  const [exercise, setExercise] = useState("");
  const [day, setDay] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [error, setError] = useState("");
  const [emptyFields, setEmptyFields] = useState([]);
  const { user } = useAuthContext();
  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const workout = { day, exercise, sets, reps };
    const response = await fetch(`${API_URL}/workouts/add`, {
      method: "POST",
      body: JSON.stringify(workout),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();
    if (response.ok) {
      setError(null);
      setExercise("");
      setDay("");
      setSets("");
      setReps("");
      dispatch({ type: "CREATE_WORKOUT", payload: json });
      setEmptyFields([]);
    } else {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
  };
  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a new Workout</h3>
      <label>Exercise Name:</label>
      <input
        type="text"
        onChange={(e) => setExercise(e.target.value)}
        value={exercise}
        className={emptyFields.includes("exercise") ? "error" : ""}
      />
      <label>Day:</label>
      <input
        type="text"
        onChange={(e) => setDay(e.target.value)}
        value={day}
        className={emptyFields.includes("day") ? "error" : ""}
      />
      <label>Sets:</label>
      <input
        type="number"
        onChange={(e) => setSets(e.target.value)}
        value={sets}
        className={emptyFields.includes("sets") ? "error" : ""}
      />
      <label>Reps:</label>
      <input
        type="number"
        onChange={(e) => setReps(e.target.value)}
        value={reps}
        className={emptyFields.includes("reps") ? "error" : ""}
      />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
      <button>Add Workout</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
}

export default WorkoutForm;
