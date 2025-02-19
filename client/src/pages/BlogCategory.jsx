import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

const BlogList = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  text-align: left;
`;

const BlogItem = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;

  h2 {
    margin: 0 0 10px 0;
  }

  p {
    margin: 0;
    color: #666;
  }
`;

const blogsData = {
  Nutrition: [
    { title: "10 Superfoods for a Healthy Life", content: "Learn about..." },
    { title: "Meal Planning Tips", content: "Discover how to..." },
  ],
  Exercise: [
    { title: "Best Cardio Workouts", content: "Boost your stamina with..." },
    { title: "Strength Training Basics", content: "Start lifting with..." },
  ],
  "Mental Health": [
    { title: "Mindfulness Practices", content: "Stay present with..." },
    { title: "Managing Stress Effectively", content: "Reduce stress by..." },
  ],
  Supplements: [
    { title: "Top 5 Supplements for Fitness", content: "Enhance your..." },
    { title: "When to Take Protein", content: "Maximize gains with..." },
  ],
};

const BlogCategory = () => {
  const { category } = useParams();
  const blogs = blogsData[category] || [];

  return (
    <BlogList>
      <h1>{category} Blogs</h1>
      {blogs.map((blog, index) => (
        <BlogItem key={index}>
          <h2>{blog.title}</h2>
          <p>{blog.content}</p>
        </BlogItem>
      ))}
    </BlogList>
  );
};

export default BlogCategory;
