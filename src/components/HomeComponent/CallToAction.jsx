import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

const CallToAction = () => {
  return (
    <div className="cta-section text-center mt-24 animate__animated animate__fadeIn animate__delay-4s">
      <h2 className="text-3xl font-semibold mb-6">Want to Share Your Ideas?</h2>
      <p className="text-xl mb-6">Create your own post and share with the world.</p>
      <Link to="/PoeticOdyssey/add-post">
        <button onClick={() => window.scrollTo(0, 0)} className="cta-button ml-0 break-words">
          <FontAwesomeIcon icon={faPencilAlt} className='mr-2' />
          Create a Post
        </button>
      </Link>
    </div>
  );
};

export default CallToAction;