import { useState } from "react";
import CommentForm from "./CommentForm";

function PostCard({ initialPost }) {
  const [post, setPost] = useState(initialPost);

  const handleCommentAdded = (updatedPost) => {
    setPost(updatedPost);
  };

  return (
    <div className="post-card">
      <h3>
        {post.teamOne} vs {post.teamTwo}
      </h3>
      <p>Final Score: {post.score}</p>
      <p>{post.description}</p>
      <img src={post.imageUrl} alt="Match" style={{ width: "300px" }} />

      <div>
        <h4>Comments:</h4>
        {post.comments?.map((comment) => (
          <div key={comment._id} style={{ marginBottom: "8px" }}>
            <img
              src={comment.userProfileImageUrl}
              alt={comment.userName}
              width="30"
              style={{ borderRadius: "50%", marginRight: "8px" }}
            />
            <strong>{comment.userName}</strong>: {comment.text}
          </div>
        ))}
      </div>

      <CommentForm postId={post._id} onCommentAdded={handleCommentAdded} />
    </div>
  );
}

export default PostCard;
