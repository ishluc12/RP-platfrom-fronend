import api from "./api";

const authService = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  refreshToken: () => api.post("/auth/refresh-token"),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, newPassword) => api.post("/auth/reset-password", { token, newPassword }),
  logout: () => api.post("/auth/logout"),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (profileData) => api.put("/auth/profile", profileData),
  uploadProfilePicture: (formData) => api.post("/auth/profile/picture", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
  changePassword: (passwords) => api.put("/auth/change-password", passwords),
  getHealth: () => api.get("/auth/health"),
};

export default authService;
