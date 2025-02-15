import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import '../../styles/loader.css';
import '../../styles/allPosts.css';
import dynamoService from '../../aws/dynamoService';
import Container from '../container/Container';
import PostList from '../PostPageDetails/PostList';
import Pagination from '../PostPageDetails/Pagination';
import NoPostsMessage from '../PostPageDetails/NoPostsMessage';
import dynamoUserInformationService from '../../aws/dynamoUserInformationService';

const UserPostsComponent = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;
  const [isAnimating, setIsAnimating] = useState(false);
  const userData = useSelector(state => state.auth.userData);
  const profileId = useParams()

  useEffect(() => {
    if(userData || profileId?.slug){
      const fetchUserPosts = async () => {
        setLoading(true);
        let userInfo;
        if(profileId?.slug){
          userInfo = await dynamoUserInformationService.getUserInfoByUserNameId(profileId.slug);
        }else{
          userInfo = await dynamoUserInformationService.getUserInfoByUserNameId(userData.userId);
        }
        
        if(userInfo){
          const userPostsData = await dynamoService.getPostsByIds(userInfo.postsCreated)
          if (userPostsData) {
            setPosts(userPostsData);
          }
        }
        setLoading(false);
      };
  
      fetchUserPosts();
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

export default UserPostsComponent;