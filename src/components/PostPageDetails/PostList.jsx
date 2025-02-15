import React from 'react';
import PostCardComponent from '../PostCardComponent/PostCardComponent';

const PostList = ({ posts, currentPage, postsPerPage, isAnimating }) => {
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="flex flex-wrap justify-center">
      {currentPosts.map((post) => (
        <div
          className={`p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 ${isAnimating ? 'fly-away' : 'fade-in'}`}
          key={post.blogId}
        >
          <PostCardComponent {...post} />
        </div>
      ))}
    </div>
  );
};

export default PostList;