import React, { useState } from "react";
import axios from "axios";

const Tutorial = () => {
  const [bodyPart, setBodyPart] = useState("");
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchExercises = async () => {
    if (!bodyPart) {
      setError("Please select a body part.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}?limit=10&offset=0`,
        {
          headers: {
            "X-Rapidapi-Key": import.meta.env.VITE_RAPIDAPI_KEY, // Use environment variable
            "X-Rapidapi-Host": "exercisedb.p.rapidapi.com",
          },
        }
      );

      if (response.data.length === 0) {
        setError("No exercises found for this body part.");
      } else {
        setExercises(response.data);
      }
    } catch (err) {
      console.error(
        "API Error:",
        err.response ? err.response.data : err.message
      );
      setError(
        "Error fetching exercises. Please check the body part or try again later."
      );
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px",
        maxWidth: "1000px",
        margin: "auto",
        minHeight: "100vh",
        overflowY: "auto",
      }}
    >
      <h2>Find Exercises for Your Target Body Part</h2>

      {/* Dropdown for better user experience */}
      <select
        value={bodyPart}
        onChange={(e) => setBodyPart(e.target.value)}
        style={{ padding: "10px", width: "300px", margin: "10px" }}
      >
        <option value="">Select a Body Part</option>
        <option value="back">Back</option>
        <option value="chest">Chest</option>
        <option value="legs">Legs</option>
        <option value="biceps">Biceps</option>
        <option value="triceps">Triceps</option>
        <option value="shoulders">Shoulders</option>
        <option value="abs">Abs</option>
      </select>

      <button
        onClick={fetchExercises}
        style={{ padding: "10px 20px", marginLeft: "10px", cursor: "pointer" }}
      >
        Search
      </button>

      {loading && <p>Loading exercises...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {exercises.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            {exercises.map((exercise, index) => (
              <div
                key={index}
                style={{
                  padding: "15px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                  textAlign: "left",
                }}
              >
                <h4>{exercise.name}</h4>
                <p>
                  <strong>Target Muscle:</strong> {exercise.target}
                </p>
                <p>
                  <strong>Equipment:</strong> {exercise.equipment}
                </p>
                <img
                  src={exercise.gifUrl}
                  alt={exercise.name}
                  width="100%"
                  style={{ borderRadius: "10px" }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tutorial;
