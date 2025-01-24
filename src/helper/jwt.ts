import jwt from 'jsonwebtoken';

// Function to verify JWT token
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'SecretKey');
  } catch (error) {
    return null;
  }
};

// Function to authorize the role of a user
export const authorizeRole = (allowedRoles: string[], userRole: string): boolean => {
  // Check if the user's role is one of the allowed roles
  return allowedRoles.includes(userRole);
};

// Helper function to handle the common logic of verifying token and authorizing role
export const handleTokenVerification = (token: string, allowedRoles: string[]) => {
  // Verify the token
  const decoded = verifyToken(token);
  if (!decoded) {
    return { error: 'Invalid or expired token' };
  }

  // Check if the user's role is authorized
  const isAuthorized = authorizeRole(allowedRoles, decoded.role);
  if (!isAuthorized) {
    return { error: 'You are not authorized to access this resource' };
  }

  return { decoded };
};
