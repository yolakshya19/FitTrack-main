import React from "react";
import "./Exercise.css";

const Exercise = () => {
  return (
    <div className="exercise-container">
      <h1>Exercise Tracker</h1>
      <div className="video-container">
        <h2>Live Video Feed</h2>
        <img
          src="http://127.0.0.1:5000/video_feed"
          alt="Live Video Feed"
          className="video-feed"
        />
      </div>
    </div>
  );
};

export default Exercise;
