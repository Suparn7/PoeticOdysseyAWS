import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Logo from '../Logo';
import PostCardLoader from './PostCardLoader';
import PostCardImage from './PostCardImage';
import PostCardContent from './PostCardContent';
import PostCardAuthor from './PostCardAuthor';
import PostCardTitle from './PostCardTitle';
import PostCardThemeToggle from './PostCardThemeToggle';
import { fetchAuthorInfo } from '../../actions/postCardActions';
import './postCardStyles/PostCard.css';

const PostCardComponent = ({ blogId, title, content, featuredImage, userId }) => {
  const [author, setAuthor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  useEffect(() => {
    const getAuthor = async () => {
      const user = await fetchAuthorInfo(userId, setAuthor, setLoading, setFadeOut);
    };
    getAuthor();
  }, [userId]);

  const toggleTheme = () => {
    setIsDarkTheme(prevTheme => !prevTheme);
  };
  return (
    <div className={`post-card ${isDarkTheme ? 'post-card-dark' : 'post-card-light'}`}>
      <PostCardThemeToggle isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
      <div className="logo-container">
        <Logo width='60px' />
      </div>
      {loading && <PostCardLoader fadeOut={fadeOut} />}
      <PostCardImage featuredImage={featuredImage} title={title} />
      <PostCardTitle title={title} />
      <PostCardAuthor author={author} />
      <PostCardContent content={content} />
      <Link to={`/PoeticOdyssey/post/${blogId}`}>
        <div className="read-more">
          Read More
        </div>
      </Link>
    </div>
  );
};

export default PostCardComponent;