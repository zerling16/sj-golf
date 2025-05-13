import { useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";

const WorkoutForm = ({ workout }) => {
  const { dispatch } = useWorkoutsContext();
  const [exercise, setExercise] = useState("");
  const [day, setDay] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [error, setError] = useState("");
  const [emptyFields, setEmptyFields] = useState([]);
  const { user } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const workout = { day, exercise, sets, reps };
    const response = await fetch("/workouts/add", {
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
      <button>Add Workout</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default WorkoutForm;
