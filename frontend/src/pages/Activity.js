import { useAuthContext } from "../hooks/useAuthContext";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

const Activity = () => {
  const { user } = useAuthContext();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/image/getPosts`, {
          headers: { Authorization: `Bearer ${user.token}` },
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
    <div className="wrapper">
      {error && <div className="error">{error}</div>}
      <div className="post-container">
        <h2>Activity Feed</h2>
        {posts.map((post) => (
          <PostCard key={post._id} initialPost={post} />
        ))}
      </div>
    </div>
  );
};

export default Activity;
