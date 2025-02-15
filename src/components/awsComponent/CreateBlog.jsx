import React from 'react'
import dynamoService from '../../aws/dynamoService'

const createBlogonAws = async () => {
    try {
        const blogData = {
            title: 'My First Blog',
            content: 'This is the content of my first blog.',
            authorId: 'user123',
        };

        const response = await dynamoService.createBlog(blogData);
        console.log(response.message);
    } catch (error) {
        console.error('Error creating blog:', error);
    }
};

const CreateBlog = () => {
  return (
    <div>
      <button
      onClick={createBlogonAws}
      > create </button>
    </div>
  )
}

export default CreateBlog
