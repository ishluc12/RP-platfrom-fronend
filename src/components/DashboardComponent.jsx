import React from 'react';
import StudentDashboard from './dashboard/StudentDashboard';
import AdminDashboard from './dashboard/AdminDashboard';
import LecturerDashboard from './dashboard/LecturerDashboard';

export default function DashboardComponent({ user, route }) {
    if (!user || !user.role) {
        return <div className="p-6 text-center text-red-600">Error: User role not defined.</div>;
    }

    switch (user.role) {
        case 'student':
            return <StudentDashboard user={user} route={route} />;
        case 'admin':
        case 'administrator': // Assuming 'administrator' maps to AdminDashboard
        case 'sys_admin': // Assuming 'sys_admin' maps to AdminDashboard
            return <AdminDashboard user={user} route={route} />;
        case 'lecturer':
            return <LecturerDashboard user={user} route={route} />;
        default:
            return <div className="p-6 text-center text-red-600">Error: Unknown user role: {user.role}</div>;
    }
}
