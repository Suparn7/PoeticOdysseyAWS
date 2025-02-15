import React from 'react';
import Container from '../container/Container';

const NoPostsMessage = () => (
  <div className='w-full py-8'>
    <Container>
      <div className="flex items-center justify-center h-60">
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 p-12 w-96 rounded-xl shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl hover:rotate-2 animate-fadeIn">
          <h1 className="text-white text-2xl font-semibold text-center">
            Write some blogs to have your post published.
          </h1>
        </div>
      </div>
    </Container>
  </div>
);

export default NoPostsMessage;