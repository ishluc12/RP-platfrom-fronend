import React from 'react';
import { FaSearch, FaUserCircle } from 'react-icons/fa';

const Header = ({ pageTitle }) => {
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b-4 border-indigo-600">
            <div className="flex items-center">
                <h2 className="text-2xl font-semibold text-gray-800">{pageTitle}</h2>
            </div>
            <div className="flex items-center">
                <div className="relative mx-4 lg:mx-0">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <FaSearch className="h-4 w-4 text-gray-500" />
                    </span>
                    <input className="form-input w-32 sm:w-64 rounded-md pl-10 pr-4" type="text" placeholder="Search" />
                </div>
                <FaUserCircle className="h-8 w-8 text-gray-600" />
            </div>
        </header>
    );
};

export default Header;
