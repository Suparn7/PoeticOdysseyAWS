import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../Logo';

const LogoAndSiteName = () => {
    return (
        <div className='flex items-center space-x-6'>
            <Link to="/PoeticOdyssey" className="flex items-center space-x-2">
                <Logo 
                    width='70px' 
                    className='transition-all duration-700 ease-in-out transform hover:scale-110 relative top-2'
                />
            </Link>
        </div>
    );
};

export default LogoAndSiteName;