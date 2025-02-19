import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const BlogContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

const BlogCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }

  img {
    width: 100%;
    height: auto;
    border-radius: 10px;
  }

  h3 {
    margin-top: 15px;
    font-size: 1.2rem;
    color: #333;
  }
`;

const Blogs = () => {
  const navigate = useNavigate();
  const categories = [
    { title: "Nutrition", image: "/images/nutrition.jpg" },
    { title: "Exercise", image: "/images/exercise.jpg" },
    { title: "Mental Health", image: "/images/mental_health.jpg" },
    { title: "Supplements", image: "/images/supplements.jpg" },
  ];

  const handleCardClick = (category) => {
    navigate(`/category/${category}`);
  };

  return (
    <BlogContainer>
      {categories.map((category, index) => (
        <BlogCard key={index} onClick={() => handleCardClick(category.title)}>
          <img src={category.image} alt={category.title} />
          <h3>{category.title}</h3>
        </BlogCard>
      ))}
    </BlogContainer>
  );
};

export default Blogs;
