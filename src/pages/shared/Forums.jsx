import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import ForumList from '../../components/shared/forums/ForumList';

const Forums = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header pageTitle="Forums" />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-2">Community Forums</h1>
                    <p className="text-gray-600 mb-6">Engage in discussions, ask questions, and share knowledge with your peers.</p>

                    <ForumList />
                </main>
            </div>
        </div>
    );
};

export default Forums;
