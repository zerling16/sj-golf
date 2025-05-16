import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

function CommentForm({ postId, onCommentAdded }) {
  const { user } = useAuthContext();
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${API_URL}/image/addComment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ text: commentText, postId: postId }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Failed to add comment");
    } else {
      setError("");
      setCommentText("");
      onCommentAdded(data); // Refresh post or comments list
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Write a comment..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      />
      <button type="submit">Post Comment</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}

export default CommentForm;
