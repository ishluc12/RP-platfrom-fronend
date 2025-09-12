// Constants for the application

export const ROLES = {
    STUDENT: 'student',
    LECTURER: 'lecturer',
    ADMIN: 'admin',
};

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        FORGOT_PASSWORD: '/auth/forgot-password',
    },
    SHARED: {
        POSTS: '/posts',
        MESSAGES: '/messages',
        FORUMS: '/forums',
        NOTIFICATIONS: '/notifications',
    },
    STUDENT: {
        APPOINTMENTS: '/student/appointments',
        EVENTS: '/student/events',
        POLLS: '/student/polls',
    },
    LECTURER: {
        APPOINTMENTS: '/lecturer/appointments',
        AVAILABILITY: '/lecturer/availability',
        EVENTS: '/lecturer/events',
        POLLS: '/lecturer/polls',
    },
    ADMIN: {
        USERS: '/admin/users',
        EVENTS: '/admin/events',
        FORUMS: '/admin/forums',
        ANALYTICS: '/admin/analytics',
    },
};
