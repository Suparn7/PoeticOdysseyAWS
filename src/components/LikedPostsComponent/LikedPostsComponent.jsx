import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import '../../styles/loader.css';
import '../../styles/allPosts.css';
import dynamoService from '../../aws/dynamoService';
import Container from '../container/Container';
import PostList from '../PostPageDetails/PostList';
import Pagination from '../PostPageDetails/Pagination';
import NoPostsMessage from '../PostPageDetails/NoPostsMessage';

const LikedPostsComponent = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;
  const [isAnimating, setIsAnimating] = useState(false);
  const likedPostsIds = useSelector(state => state.user.likedPosts)
  const userData = useSelector(state => state.auth.userData);
  
  useEffect(() => {
    if(userData){
      const fetchLikedPosts = async () => {
        setLoading(true);
        if(likedPostsIds.length > 0) {
          const likedPostsData = await dynamoService.getPostsByIds(likedPostsIds)
          console.log(likedPostsData)
          if (likedPostsData) {
            setPosts(likedPostsData);
          }
        }
        setLoading(false);
      };
  
      fetchLikedPosts();
    }
  }, [userData]);

  const handlePageChange = (pageNumber) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentPage(pageNumber);
      setIsAnimating(false);
    }, 300);
    window.scrollTo(0, 0);
  };

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

  if (posts && posts.length === 0) {
    return <NoPostsMessage />;
  }

  return (
    <div className='w-full py-8'>
      <Container>
        <PostList posts={posts} currentPage={currentPage} postsPerPage={postsPerPage} isAnimating={isAnimating} />
        <Pagination currentPage={currentPage} totalPages={Math.ceil(posts.length / postsPerPage)} handlePageChange={handlePageChange} />
      </Container>
    </div>
  );
};

export default LikedPostsComponent;