import React from 'react';
import Input from '../Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeather } from '@fortawesome/free-solid-svg-icons';

const TitleInput = ({ register, handleKeyDown }) => (
  <Input
    label="Title"
    placeholder="Title"
    className="mb-4 !bg-gray-700 text-white transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 placeholder:text-gray-400 rounded-3xl hover:ring-2 hover:ring-blue-500 transform hover:scale-105"
    {...register("title", { required: true })}
    onKeyDown={handleKeyDown}
    icon={<FontAwesomeIcon icon={faFeather} className="text-gray-400" />}
  />
);

export default TitleInput;