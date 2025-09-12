// Utility functions for validation

export const isValidEmail = (email) => {
    // Basic email validation regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPassword = (password) => {
    // Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$/.test(password);
};
