import React from 'react';
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';

const ActionButtons = ({ postId, confirmDelete }) => {
    return (
        <div className="absolute top-[-8px] flex space-x-4 z-10">
            <EditButton postId={postId} />
            <DeleteButton confirmDelete={confirmDelete} />
        </div>
    );
};

export default ActionButtons;