import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import PostCard from '../PostCard';
import PostCardComponent from '../PostCardComponent/PostCardComponent';


const PostsSlider = ({ posts }) => {
  const postsContainerRef = useRef(null);
  const [leftIconVisible, setLeftIconVisible] = useState(false);
  const [rightIconVisible, setRightIconVisible] = useState(true);

  const scrollLeft = () => {
    if (postsContainerRef.current) {
      postsContainerRef.current.scrollBy({
        left: -340,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (postsContainerRef.current) {
      postsContainerRef.current.scrollBy({
        left: 340,
        behavior: 'smooth',
      });
    }
  };

  const checkScrollPosition = () => {
    const container = postsContainerRef.current;
    if (container) {
      const canScrollLeft = container.scrollLeft > 0;
      const canScrollRight = container.scrollLeft < container.scrollWidth - container.clientWidth;
      return { canScrollLeft, canScrollRight };
    }
    return { canScrollLeft: false, canScrollRight: false };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const { canScrollLeft, canScrollRight } = checkScrollPosition();
      setLeftIconVisible(canScrollLeft);
      setRightIconVisible(canScrollRight);
    }, 100);

    return () => clearInterval(interval);
  }, [posts]);

  return (
    <div className="small-posts-slider" >
      <h2 className="text-3xl font-semibold mb-4 text-center">Recent Posts</h2>
      <div className={`posts-container flex overflow-x-auto space-x-6 py-10 px-2 ${posts.length <= 3 ? 'justify-center' : ''}`} ref={postsContainerRef} >
          {posts.slice(0, Math.min(5, posts.length)).map((post, index) => (
            <div key={index} className="post-card-container" >
              <PostCardComponent {...post} />
            </div>
          ))}
        </div>

      {leftIconVisible && (
        <div className="slider-icon left" onClick={scrollLeft}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </div>
      )}
      {rightIconVisible && (
        <div className="slider-icon right" onClick={scrollRight}>
          <FontAwesomeIcon icon={faChevronRight} />
        </div>
      )}
    </div>
  );
};

export default PostsSlider;