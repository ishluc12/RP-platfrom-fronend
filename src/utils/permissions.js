// Utility functions for permission checking

export const hasPermission = (userRole, requiredRoles) => {
    if (!userRole || !requiredRoles || requiredRoles.length === 0) {
        return false;
    }
    return requiredRoles.includes(userRole);
};
