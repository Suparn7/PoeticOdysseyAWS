import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";

import { Link } from "react-router-dom";
import UsersModal from '../UsersModal/UsersModal.jsx';
import dynamoService from '../../aws/dynamoService.js';
import HeroSection from './HeroSection';
import PostsSlider from './PostsSlider';
import NoPostsBanner from './NoPostsBanner';
import CallToAction from './CallToAction';
import '../../styles/loader.css';
import "./homeStyles/home.css";
import Container from '../container/Container.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBinoculars } from '@fortawesome/free-solid-svg-icons';

const HomeComponent = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const user = useSelector((state) => state.auth.userData);
  const userInfoData = useSelector((state) => state.user.userData);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      if (authStatus) {
        try {
          const postsData = await dynamoService.getPosts();
          if (postsData) {
            setPosts(postsData.posts);
          }
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      }
      setLoading(false);
    };
    fetchPosts();
  }, [authStatus]);

  if (loading) {
    return (
      <Container>
        <div className="loader-overlay">
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        </div>
      </Container>
    );
  }

  if (!authStatus) {
    return (
      <div className='w-full py-8'>
        <Container>
          <div className="flex items-center justify-center h-full">
            <div className="relative bg-gray-800 text-white p-8 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 w-full max-w-md">
              <h1 className="text-2xl text-center mb-4">
                Please <Link to="/PoeticOdyssey/login" className="text-blue-400 underline hover:text-blue-300">Login</Link> to see or create a Post.
              </h1>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className='w-full py-8 waving-animation'>
      <Container>
        <HeroSection userInfoData={userInfoData} />
        <div className="text-center mt-10 waving-animation">
          <button onClick={() => setIsModalOpen(true)} className="ml-0 cta-button">
            <FontAwesomeIcon icon={faUsers} className="mr-2 animate-pulse text-2xl" title="Exploring new worlds" color='rgba(255, 255, 255, 0.8)' />
            View All Users
          </button>
          <Link to="/PoeticOdyssey/all-posts">
            <button className="explore-button ml-0">
              <FontAwesomeIcon icon={faBinoculars} className="mr-2 animate-pulse text-2xl" title="Exploring new worlds" color='rgba(255, 255, 255, 0.8)' />
              Explore All Posts
            </button>
          </Link>
        </div>
        {posts && posts.length > 0 ? (
          <PostsSlider posts={posts} />
        ) : (
          <NoPostsBanner />
        )}
        <UsersModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} loading={loading} />
        <CallToAction />
      </Container>
    </div>
  );
};

export default HomeComponent;