import React from 'react';
import { FaHome, FaCalendarAlt, FaCalendarCheck, FaEnvelope, FaClipboardList, FaUsers, FaComments, FaBell, FaCog, FaSignOutAlt, FaBullhorn, FaBookOpen, FaChartBar, FaUserShield, FaClipboard } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const Sidebar = ({ user }) => {
    const location = useLocation();

    const studentNavigation = [
        { name: 'Dashboard', icon: FaHome, href: '/student/dashboard' },
        { name: 'Appointments', icon: FaCalendarAlt, href: '/student/appointments' },
        { name: 'Events', icon: FaCalendarCheck, href: '/student/events' },
        { name: 'Messages', icon: FaEnvelope, href: '/student/messages' },
        { name: 'Feed', icon: FaClipboardList, href: '/student/feed' },
        { name: 'Polls', icon: FaClipboardList, href: '/student/polls' },
        { name: 'Users', icon: FaUsers, href: '/directory' }, // Shared directory
        { name: 'Feedback', icon: FaComments, href: '/student/feedback' },
        { name: 'Notifications', icon: FaBell, href: '/student/notifications' },
        { name: 'Settings', icon: FaCog, href: '/settings' }, // Shared settings
    ];

    const lecturerNavigation = [
        { name: 'Dashboard', icon: FaHome, href: '/lecturer/dashboard' },
        { name: 'Announcements', icon: FaBullhorn, href: '/lecturer/announcements' },
        { name: 'Appointments', icon: FaCalendarAlt, href: '/lecturer/appointments' },
        { name: 'Messages', icon: FaEnvelope, href: '/lecturer/messages' },
        { name: 'Events', icon: FaCalendarCheck, href: '/lecturer/events' },
        { name: 'Notifications', icon: FaBell, href: '/lecturer/notifications' },
        { name: 'Feedback', icon: FaComments, href: '/lecturer/feedback' },
        { name: 'Settings', icon: FaCog, href: '/settings' },
        { name: 'My Students', icon: FaUsers, href: '/directory' }, // Can be filtered for their students
        { name: 'My Courses', icon: FaBookOpen, href: '/lecturer/courses' }, // Placeholder
    ];

    const adminNavigation = [
        { name: 'Dashboard', icon: FaHome, href: '/admin/dashboard' },
        { name: 'Users', icon: FaUserShield, href: '/admin/users' },
        { name: 'Appointments', icon: FaCalendarAlt, href: '/admin/appointments' },
        { name: 'Events', icon: FaCalendarCheck, href: '/admin/events' },
        { name: 'Feedback', icon: FaComments, href: '/admin/feedback' },
        { name: 'Feedback Forms', icon: FaClipboardList, href: '/admin/feedback-forms' },
        { name: 'Community Feed', icon: FaClipboard, href: '/admin/community-feed' },
        { name: 'Polls', icon: FaClipboardList, href: '/admin/polls' },
        { name: 'Announcements', icon: FaBullhorn, href: '/admin/announcements' },
        { name: 'Analytics', icon: FaChartBar, href: '/admin/analytics' },
        { name: 'Settings', icon: FaCog, href: '/settings' },
    ];

    let currentNavigation;
    if (user?.role === 'lecturer') {
        currentNavigation = lecturerNavigation;
    } else if (user?.role === 'admin' || user?.role === 'sys_admin') {
        currentNavigation = adminNavigation;
    } else {
        currentNavigation = studentNavigation;
    }

    return (
        <div className="flex flex-col w-64 bg-gray-800 text-white">
            <div className="flex items-center justify-center h-16 bg-gray-900 shadow-md">
                <img src="/public/kigali_college_logo.png" alt="Kigali College Logo" className="h-8" />
                <span className="text-xl font-semibold ml-2">RP Platform</span>
            </div>
            <div className="flex items-center p-4 border-b border-gray-700">
                <img
                    className="h-10 w-10 rounded-full object-cover mr-4"
                    src="https://via.placeholder.com/150"
                    alt={`${user?.name} Profile`}
                />
                <div>
                    <p className="font-semibold">{user?.name || 'Guest'}</p>
                    <p className="text-sm text-gray-400">{user?.role || 'Guest'}</p>
                </div>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {currentNavigation.map((item) => (
                    <a
                        key={item.name}
                        href={item.href}
                        className={`flex items-center px-4 py-2 rounded-md ${location.pathname === item.href ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                    >
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.name}
                    </a>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-700">
                <a
                    href="/logout"
                    className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
                >
                    <FaSignOutAlt className="h-5 w-5 mr-3" />
                    Logout
                </a>
            </div>
        </div>
    );
};

export default Sidebar;
