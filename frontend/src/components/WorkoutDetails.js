import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { useAuthContext } from "../hooks/useAuthContext";

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();
  const API_URL = process.env.API_URL;
  const handleClick = async () => {
    if (!user) {
      return;
    }
    const response = await fetch(`${API_URL}/workouts/${workout._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const json = await response.json();
    if (response.ok) {
      dispatch({ type: "DELETE_WORKOUT", payload: json });
    }
  };

  return (
    <div className="workout-details">
      <h4>{workout.exercise}</h4>
      <p>
        <strong>Day: </strong>
        {workout.day}
      </p>
      <p>
        <strong>Sets: </strong>
        {workout.sets}
      </p>
      <p>
        <strong>Reps: </strong>
        {workout.reps}
      </p>
      <span className="material-symbols-outlined" onClick={handleClick}>
        delete
      </span>
      <p>
        {formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}
      </p>
    </div>
  );
};
export default WorkoutDetails;
