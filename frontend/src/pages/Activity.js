import { useEffect, useState } from "react";
import WorkoutDetails from "../components/WorkoutDetails";
import WorkoutForm from "../components/WorkoutForm";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";

const Activity = () => {
  //const { workouts, dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/image/getPosts`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to load posts");
        } else {
          setPosts(data);
        }
      } catch (err) {
        setError("Network error");
      }
    };

    fetchPosts();
  }, [API_URL, user]);

  return (
    <div>
      <h2>Activity Feed</h2>
      {error && <div className="error">{error}</div>}
      {posts.map((post) => (
        <div key={post._id} className="post-card">
          <h3>
            {post.teamOne} vs {post.teamTwo}
          </h3>
          <p>Final Score: {post.score}</p>
          <p>{post.description}</p>
          <img src={post.imageUrl} alt="Match" style={{ width: "300px" }} />
          <hr />
        </div>
      ))}
    </div>
  );
};

export default Activity;
