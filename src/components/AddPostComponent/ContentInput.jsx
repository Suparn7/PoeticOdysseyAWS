import React from 'react';
import RTE from '../RTE';

const ContentInput = ({ control, getValues }) => (
  <RTE
    label="Content"
    name="content"
    control={control}
    defaultValue={getValues('content')}
    className="transition-all duration-300 focus:ring-2 focus:ring-blue-300 !bg-gray-700 text-white hover:ring-2 hover:ring-blue-500 transform hover:scale-105"
  />
);

export default ContentInput;