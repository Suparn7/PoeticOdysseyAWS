import React from 'react';
import Button from '../Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

const SubmitButton = ({ post }) => (
  <Button
    type="submit"
    bgColor={post ? "bg-green-500" : "bg-blue-500"}
    className="ml-0 w-full transition-all duration-500 transform hover:scale-105 hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-600 hover:shadow-2xl text-white font-semibold uppercase rounded-lg flex items-center justify-center space-x-3"
  >
    <FontAwesomeIcon
      icon={post ? faSyncAlt : faPaperPlane} 
      className="text-xl animate-pulse"
    />
    <span>{post ? "Update" : "Submit"}</span>
  </Button>
);

export default SubmitButton;