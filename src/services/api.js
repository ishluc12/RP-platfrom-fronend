/*
 Centralized API service for RP Platform
 - Groups all backend endpoints under organized namespaces
 - Uses fetch with a small wrapper for JSON and FormData handling
 - Automatically attaches Authorization header if a token exists in localStorage
 - Reads API base URL from VITE_API_BASE_URL, defaults to http://localhost:5000
*/

let API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL
  : undefined;

if (!API_BASE_URL) {
  // In Vite dev, prefer relative base so the dev proxy handles /api -> backend
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
    API_BASE_URL = '';
  } else if (typeof window !== 'undefined' && window.location) {
    // In production builds without explicit env, default to same-origin
    API_BASE_URL = window.location.origin;
  } else {
    // Final fallback
    API_BASE_URL = 'http://localhost:5000';
  }
}

function getToken() {
  try {
    return localStorage.getItem('token');
  } catch (_) {
    return null;
  }
}

function buildQuery(params) {
  if (!params) return '';
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (Array.isArray(v)) {
      v.forEach((val) => usp.append(k, String(val)));
    } else {
      usp.append(k, String(v));
    }
  });
  const qs = usp.toString();
  return qs ? `?${qs}` : '';
}

async function request(path, { method = 'GET', headers = {}, body, params, isFormData = false } = {}) {
  const url = `${API_BASE_URL}${path}${buildQuery(params)}`;
  const token = getToken();

  const finalHeaders = new Headers(headers);
  if (!isFormData) {
    finalHeaders.set('Content-Type', 'application/json');
  }
  if (token) {
    finalHeaders.set('Authorization', `Bearer ${token}`);
  }

  const options = {
    method,
    headers: finalHeaders,
  };

  if (body !== undefined && body !== null) {
    options.body = isFormData ? body : JSON.stringify(body);
  }

  let res;
  let text;
  try {
    res = await fetch(url, options);
    text = await res.text();
  } catch (networkErr) {
    const err = new Error('Unable to connect to the API server');
    err.status = 0;
    err.data = null;
    err.url = url;
    err.cause = networkErr;
    throw err;
  }

  // Attempt to parse JSON always when possible
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const err = new Error((data && data.message) || res.statusText || 'Request failed');
    err.status = res.status;
    err.data = data;
    err.url = url;
    throw err;
  }

  return data;
}

function toFormData(obj = {}) {
  const fd = new FormData();
  Object.entries(obj).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (Array.isArray(v)) {
      v.forEach((item) => fd.append(k, item));
    } else {
      fd.append(k, v);
    }
  });
  return fd;
}

// Namespaces per backend route groups
const Api = {
  // Health
  health: () => request('/health'),

  // Auth routes: /api/auth
  auth: {
    register: (payload) => request('/api/auth/register', { method: 'POST', body: payload }),
    login: (payload) => request('/api/auth/login', { method: 'POST', body: payload }),
    refreshToken: (payload) => request('/api/auth/refresh-token', { method: 'POST', body: payload }),
    forgotPassword: (payload) => request('/api/auth/forgot-password', { method: 'POST', body: payload }),
    resetPassword: (payload) => request('/api/auth/reset-password', { method: 'POST', body: payload }),
    logout: () => request('/api/auth/logout', { method: 'POST' }),

    profile: {
      get: () => request('/api/auth/profile'),
      update: (payload) => request('/api/auth/profile', { method: 'PUT', body: payload }),
      changePassword: (payload) => request('/api/auth/change-password', { method: 'PUT', body: payload }),
      uploadPicture: (file) => {
        const fd = toFormData({ profile_picture: file });
        return request('/api/auth/profile/picture', { method: 'POST', body: fd, isFormData: true });
      },
      health: () => request('/api/auth/health'),
    },
  },

  // Shared routes: /api/shared
  shared: {
    // Users
    users: {
      search: (params) => request('/api/shared/users/search', { params }),
      byRole: (role) => request(`/api/shared/users/role/${encodeURIComponent(role)}`),
      byDepartment: (department) => request(`/api/shared/users/department/${encodeURIComponent(department)}`),
      statsOverview: () => request('/api/shared/users/stats/overview'),
      connections: () => request('/api/shared/users/connections'),
      updateStatus: (payload) => request('/api/shared/users/status', { method: 'PUT', body: payload }),
      getById: (id) => request(`/api/shared/users/${encodeURIComponent(id)}`),
      activity: (id) => request(`/api/shared/users/${encodeURIComponent(id)}/activity`),
      toggleFollow: (targetUserId) => request(`/api/shared/users/${encodeURIComponent(targetUserId)}/follow`, { method: 'POST' }),
    },

    // Posts
    posts: {
      create: (payload) => request('/api/shared/posts', { method: 'POST', body: payload }),
      feed: (params) => request('/api/shared/posts', { params }),
      getById: (id) => request(`/api/shared/posts/${encodeURIComponent(id)}`),
      update: (id, payload) => request(`/api/shared/posts/${encodeURIComponent(id)}`, { method: 'PUT', body: payload }),
      remove: (id) => request(`/api/shared/posts/${encodeURIComponent(id)}`, { method: 'DELETE' }),
      like: (postId) => request(`/api/shared/posts/${encodeURIComponent(postId)}/like`, { method: 'POST' }),
      unlike: (postId) => request(`/api/shared/posts/${encodeURIComponent(postId)}/unlike`, { method: 'DELETE' }),
    },

    // Comments
    comments: {
      createForPost: (postId, payload) => request(`/api/shared/comments/post/${encodeURIComponent(postId)}`, { method: 'POST', body: payload }),
      listByPost: (postId) => request(`/api/shared/comments/post/${encodeURIComponent(postId)}`),
      remove: (commentId) => request(`/api/shared/comments/${encodeURIComponent(commentId)}`, { method: 'DELETE' }),
    },

    // Polls
    polls: {
      create: (payload) => request('/api/shared/polls', { method: 'POST', body: payload }),
      list: () => request('/api/shared/polls'),
      getById: (id) => request(`/api/shared/polls/${encodeURIComponent(id)}`),
      vote: (payload) => request('/api/shared/polls/vote', { method: 'POST', body: payload }),
    },

    // Forums
    forums: {
      create: (payload) => request('/api/shared/forums', { method: 'POST', body: payload }),
      list: () => request('/api/shared/forums'),
      getById: (id) => request(`/api/shared/forums/${encodeURIComponent(id)}`),
      update: (id, payload) => request(`/api/shared/forums/${encodeURIComponent(id)}`, { method: 'PUT', body: payload }),
      remove: (id) => request(`/api/shared/forums/${encodeURIComponent(id)}`, { method: 'DELETE' }),

      createPost: (forumId, payload) => request(`/api/shared/forums/${encodeURIComponent(forumId)}/posts`, { method: 'POST', body: payload }),
      listPosts: (forumId) => request(`/api/shared/forums/${encodeURIComponent(forumId)}/posts`),
      getPostById: (postId) => request(`/api/shared/forums/posts/${encodeURIComponent(postId)}`),
      updatePost: (postId, payload) => request(`/api/shared/forums/posts/${encodeURIComponent(postId)}`, { method: 'PUT', body: payload }),
      removePost: (postId) => request(`/api/shared/forums/posts/${encodeURIComponent(postId)}`, { method: 'DELETE' }),
    },

    // Events (shared)
    events: {
      create: (payload) => request('/api/shared/events', { method: 'POST', body: payload }),
      list: (params) => request('/api/shared/events', { params }),
      getById: (id) => request(`/api/shared/events/${encodeURIComponent(id)}`),
      update: (id, payload) => request(`/api/shared/events/${encodeURIComponent(id)}`, { method: 'PUT', body: payload }),
      remove: (id) => request(`/api/shared/events/${encodeURIComponent(id)}`, { method: 'DELETE' }),

      rsvp: (eventId) => request(`/api/shared/events/${encodeURIComponent(eventId)}/rsvp`, { method: 'POST' }),
      cancelRsvp: (eventId) => request(`/api/shared/events/${encodeURIComponent(eventId)}/rsvp`, { method: 'DELETE' }),
      participants: (eventId) => request(`/api/shared/events/${encodeURIComponent(eventId)}/participants`),
      rsvpStatus: (eventId) => request(`/api/shared/events/${encodeURIComponent(eventId)}/rsvp-status`),
      userRsvps: () => request('/api/shared/events/user-rsvps'),
    },

    // Notifications
    notifications: {
      list: () => request('/api/shared/notifications'),
      markRead: (id) => request(`/api/shared/notifications/${encodeURIComponent(id)}/read`, { method: 'PUT' }),
      markAllRead: () => request('/api/shared/notifications/mark-all-read', { method: 'PUT' }),
    },

    // Messages
    messages: {
      send: (payload) => request('/api/shared/messages', { method: 'POST', body: payload }),
      threadWith: (otherId) => request(`/api/shared/messages/thread/${encodeURIComponent(otherId)}`),
      groupMessages: (groupId) => request(`/api/shared/messages/group/${encodeURIComponent(groupId)}`),
      conversations: () => request('/api/shared/messages/conversations'),
      groups: () => request('/api/shared/messages/groups'),
    },

    // Chat groups
    chatGroups: {
      create: (payload) => request('/api/shared/chat-groups', { method: 'POST', body: payload }),
      getById: (id) => request(`/api/shared/chat-groups/${encodeURIComponent(id)}`),
      update: (id, payload) => request(`/api/shared/chat-groups/${encodeURIComponent(id)}`, { method: 'PUT', body: payload }),
      remove: (id) => request(`/api/shared/chat-groups/${encodeURIComponent(id)}`, { method: 'DELETE' }),
      addMember: (groupId, payload) => request(`/api/shared/chat-groups/${encodeURIComponent(groupId)}/members`, { method: 'POST', body: payload }),
      removeMember: (groupId, userId) => request(`/api/shared/chat-groups/${encodeURIComponent(groupId)}/members/${encodeURIComponent(userId)}`, { method: 'DELETE' }),
    },

    // Availability
    availability: {
      getByLecturer: (lecturerId) => request(`/api/shared/availability/${encodeURIComponent(lecturerId)}`),
    },
  },

  // Student routes: /api/student
  student: {
    appointments: {
      create: (payload) => request('/api/student/appointments', { method: 'POST', body: payload }),
      list: () => request('/api/student/appointments'),
      upcoming: () => request('/api/student/appointments/upcoming'),
      cancel: (id) => request(`/api/student/appointments/${encodeURIComponent(id)}`, { method: 'DELETE' }),
    },
    dashboard: {
      summary: () => request('/api/student/dashboard/summary'),
      upcomingEvents: () => request('/api/student/dashboard/upcoming-events'),
      upcomingAppointments: () => request('/api/student/dashboard/upcoming-appointments'),
      recentPosts: () => request('/api/student/dashboard/recent-posts'),
    },
    events: {
      list: () => request('/api/student/events'),
      upcoming: () => request('/api/student/events/upcoming'),
      past: () => request('/api/student/events/past'),
      search: (params) => request('/api/student/events/search', { params }),
      byCreator: (userId) => request(`/api/student/events/creator/${encodeURIComponent(userId)}`),
      byDepartment: (department) => request(`/api/student/events/department/${encodeURIComponent(department)}`),
      today: () => request('/api/student/events/today'),
      thisWeek: () => request('/api/student/events/this-week'),
      thisMonth: () => request('/api/student/events/this-month'),
      getById: (id) => request(`/api/student/events/${encodeURIComponent(id)}`),
      withParticipantCounts: () => request('/api/student/events/with-participant-counts'),
      rsvp: (id) => request(`/api/student/events/${encodeURIComponent(id)}/rsvp`, { method: 'POST' }),
      cancelRsvp: (id) => request(`/api/student/events/${encodeURIComponent(id)}/rsvp`, { method: 'DELETE' }),
      participants: (id) => request(`/api/student/events/${encodeURIComponent(id)}/participants`),
      rsvpStatus: (id) => request(`/api/student/events/${encodeURIComponent(id)}/rsvp-status`),
      stats: (id) => request(`/api/student/events/${encodeURIComponent(id)}/stats`),
      myRsvpEvents: () => request('/api/student/events/rsvp/events'),
    },
    surveys: {
      list: () => request('/api/shared/surveys/student-list'),
      getById: (id) => request(`/api/shared/surveys/${encodeURIComponent(id)}`),
      submitResponse: (id, payload) => request(`/api/shared/surveys/${encodeURIComponent(id)}/response`, { method: 'POST', body: payload }),
    },
  },

  // Lecturer routes: /api/lecturer
  lecturer: {
    appointments: {
      list: () => request('/api/lecturer/appointments'),
      upcoming: () => request('/api/lecturer/appointments/upcoming'),
      updateStatus: (id, payload) => request(`/api/lecturer/appointments/${encodeURIComponent(id)}/status`, { method: 'PUT', body: payload }),
    },
    availability: {
      create: (payload) => request('/api/lecturer/availability', { method: 'POST', body: payload }),
      mine: () => request('/api/lecturer/availability'),
      update: (id, payload) => request(`/api/lecturer/availability/${encodeURIComponent(id)}`, { method: 'PUT', body: payload }),
      remove: (id) => request(`/api/lecturer/availability/${encodeURIComponent(id)}`, { method: 'DELETE' }),
    },
    dashboard: {
      summary: () => request('/api/lecturer/dashboard/summary'),
      recentAppointments: () => request('/api/lecturer/dashboard/recent-appointments'),
      recentStudents: () => request('/api/lecturer/dashboard/recent-students'),
    },
    events: {
      create: (payload) => request('/api/lecturer/events', { method: 'POST', body: payload }),
      mine: () => request('/api/lecturer/events/my-events'),
      upcoming: () => request('/api/lecturer/events/upcoming'),
      past: () => request('/api/lecturer/events/past'),
      search: (params) => request('/api/lecturer/events/search', { params }),
      stats: () => request('/api/lecturer/events/stats'),
      statsById: (id) => request(`/api/lecturer/events/stats/${encodeURIComponent(id)}`),
      getById: (id) => request(`/api/lecturer/events/${encodeURIComponent(id)}`),
      update: (id, payload) => request(`/api/lecturer/events/${encodeURIComponent(id)}`, { method: 'PUT', body: payload }),
      remove: (id) => request(`/api/lecturer/events/${encodeURIComponent(id)}`, { method: 'DELETE' }),
      participants: (id) => request(`/api/lecturer/events/${encodeURIComponent(id)}/participants`),
    },
  },

  // Admin routes: /api/admin
  admin: {
    users: {
      list: (params) => request('/api/admin/users', { params }),
      getById: (id) => request(`/api/admin/users/${encodeURIComponent(id)}`),
      create: (payload) => request('/api/admin/users', { method: 'POST', body: payload }),
      update: (id, payload) => request(`/api/admin/users/${encodeURIComponent(id)}`, { method: 'PUT', body: payload }),
      remove: (id) => request(`/api/admin/users/${encodeURIComponent(id)}`, { method: 'DELETE' }),
      bulkUpdate: (payload) => request('/api/admin/users/bulk/update', { method: 'PUT', body: payload }),
      bulkDelete: (payload) => request('/api/admin/users/bulk/delete', { method: 'DELETE', body: payload }),
      analyticsOverview: () => request('/api/admin/users/analytics/overview'),
      exportData: () => request('/api/admin/users/export/data'),
      toggleStatus: (id, payload) => request(`/api/admin/users/${encodeURIComponent(id)}/status`, { method: 'PUT', body: payload }),
      activityLogs: (id) => request(`/api/admin/users/${encodeURIComponent(id)}/logs`),
    },

    events: {
      list: (params) => request('/api/admin/events', { params }),
      stats: () => request('/api/admin/events/stats'),
      statsById: (id) => request(`/api/admin/events/stats/${encodeURIComponent(id)}`),
      advancedFilters: (params) => request('/api/admin/events/advanced-filters', { params }),
      byUser: (userId) => request(`/api/admin/events/user/${encodeURIComponent(userId)}`),
      update: (id, payload) => request(`/api/admin/events/${encodeURIComponent(id)}`, { method: 'PUT', body: payload }),
      remove: (id) => request(`/api/admin/events/${encodeURIComponent(id)}`, { method: 'DELETE' }),
      bulkRemove: (payload) => request('/api/admin/events/bulk', { method: 'DELETE', body: payload }),
    },

    forums: {
      list: () => request('/api/admin/forums'),
      getById: (id) => request(`/api/admin/forums/${encodeURIComponent(id)}`),
      update: (id, payload) => request(`/api/admin/forums/${encodeURIComponent(id)}`, { method: 'PUT', body: payload }),
      remove: (id) => request(`/api/admin/forums/${encodeURIComponent(id)}`, { method: 'DELETE' }),
      postsByForum: (forumId) => request(`/api/admin/forums/${encodeURIComponent(forumId)}/posts`),
      postById: (postId) => request(`/api/admin/forums/posts/${encodeURIComponent(postId)}`),
      updatePost: (postId, payload) => request(`/api/admin/forums/posts/${encodeURIComponent(postId)}`, { method: 'PUT', body: payload }),
      removePost: (postId) => request(`/api/admin/forums/posts/${encodeURIComponent(postId)}`, { method: 'DELETE' }),
    },

    surveys: {
      list: () => request('/api/admin/surveys'),
      getById: (id) => request(`/api/admin/surveys/${encodeURIComponent(id)}`),
      aggregates: (params) => request('/api/admin/surveys/aggregates', { params }),
    },

    dashboard: {
      summary: () => request('/api/admin/dashboard/summary'),
      recentActivity: () => request('/api/admin/dashboard/recent-activity'),
      topCreators: () => request('/api/admin/dashboard/top-creators'),
      recentRegistrations: () => request('/api/admin/dashboard/recent-registrations'),
    },

    analytics: {
      platformStats: () => request('/api/admin/analytics/platform-stats'),
      userGrowth: () => request('/api/admin/analytics/user-growth'),
      contentOverview: () => request('/api/admin/analytics/content-overview'),
      appointmentMetrics: () => request('/api/admin/analytics/appointment-metrics'),
    },
  },
};

export default Api;
export { API_BASE_URL, request };
