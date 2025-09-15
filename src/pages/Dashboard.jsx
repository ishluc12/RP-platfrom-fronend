import { useEffect, useState } from 'react';
import { LogOut, LayoutDashboard, Users, Calendar, Megaphone, MessageSquare, List, Send, Settings, FileText, Bell } from 'lucide-react';
import Api from '../services/api';
import DashboardComponent from '../components/DashboardComponent'; // Import the new wrapper component

const navigation = {
    student: [
        { name: 'Dashboard', href: '#/dashboard', icon: LayoutDashboard, current: true, component: 'student' },
        { name: 'Appointments', href: '#/appointments', icon: Calendar, current: false },
        { name: 'Events', href: '#/events', icon: Megaphone, current: false },
        { name: 'Messages', href: '#/messages', icon: MessageSquare, current: false },
        { name: 'Feed', href: '#/feed', icon: List, current: false },
        { name: 'Polls', href: '#/polls', icon: Send, current: false },
        { name: 'Users', href: '#/users', icon: Users, current: false },
        { name: 'Feedback', href: '#/feedback', icon: FileText, current: false },
        { name: 'Notifications', href: '#/notifications', icon: Bell, current: false }, // Assuming Bell icon
        { name: 'Settings', href: '#/settings', icon: Settings, current: false },
    ],
    admin: [
        { name: 'Dashboard', href: '#/dashboard', icon: LayoutDashboard, current: true, component: 'admin' },
        { name: 'Users', href: '#/admin/users', icon: Users, current: false },
        { name: 'Appointments', href: '#/admin/appointments', icon: Calendar, current: false },
        { name: 'Events', href: '#/admin/events', icon: Megaphone, current: false },
        { name: 'Feedback', href: '#/admin/feedback', icon: FileText, current: false },
        { name: 'Community Feed', href: '#/admin/community-feed', icon: List, current: false },
        { name: 'Feedback Form Management', href: '#/admin/feedback-forms', icon: FileText, current: false },
        { name: 'Polls', href: '#/admin/polls', icon: Send, current: false },
        { name: 'Settings', href: '#/admin/settings', icon: Settings, current: false },
    ],
    lecturer: [
        { name: 'Dashboard', href: '#/dashboard', icon: LayoutDashboard, current: true, component: 'lecturer' },
        { name: 'Announcements', href: '#/announcements', icon: Megaphone, current: false },
        { name: 'Appointments', href: '#/lecturer/appointments', icon: Calendar, current: false },
        { name: 'Messages', href: '#/lecturer/messages', icon: MessageSquare, current: false },
        { name: 'Events', href: '#/lecturer/events', icon: Megaphone, current: false },
        { name: 'Notifications', href: '#/lecturer/notifications', icon: Bell, current: false }, // Assuming Bell icon
        { name: 'Feedback', href: '#/lecturer/feedback', icon: FileText, current: false },
        { name: 'Settings', href: '#/lecturer/settings', icon: Settings, current: false },
    ],
};

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Dashboard({ user, onLogout, route }) {
    // `currentContent` state is no longer needed here as DashboardComponent handles it
    // useEffect to set currentContent removed

    const userRole = user?.role || 'student';
    const navLinks = navigation[userRole] || navigation.student;

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="flex flex-col w-64 bg-gray-800 text-white shadow-xl">
                <div className="flex items-center justify-center h-16 bg-blue-700 shadow-md">
                    <span className="text-xl font-semibold">{userRole.charAt(0).toUpperCase() + userRole.slice(1)} Panel</span>
                </div>
                <div className="flex items-center p-4 border-b border-gray-700">
                    <img
                        className="h-10 w-10 rounded-full bg-white object-cover"
                        src={user?.profile_picture || '/default-avatar.png'}
                        alt="User avatar"
                    />
                    <div className="ml-3">
                        <p className="text-sm font-medium">{user?.name || user?.email}</p>
                        <p className="text-xs text-gray-400">{user?.role}</p>
                    </div>
                </div>
                <nav className="flex-1 px-2 py-4 space-y-1">
                    {navLinks.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                                item.href === route
                                    ? 'bg-blue-600 text-white' // Reverted to blue background, white text
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200'
                            )}
                        >
                            {item.icon && <item.icon className={classNames(item.href === route ? 'text-white' : 'text-gray-400 group-hover:text-gray-300', 'mr-3 flex-shrink-0 h-6 w-6')} aria-hidden="true" />}
                            {item.name}
                        </a>
                    ))}
                    <button
                        onClick={onLogout}
                        className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white w-full text-left transition-colors duration-200"
                    >
                        <LogOut className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-300" aria-hidden="true" />
                        Logout
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
                    <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                    {/* Potentially add user profile/settings here */}
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <DashboardComponent user={user} route={route} /> {/* Use DashboardComponent here */}
                </main>
            </div>
        </div>
    );
}
