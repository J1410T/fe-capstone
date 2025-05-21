import { jwtDecode } from "jwt-decode";
import { UserRole } from "../contexts/AuthContext";

// Mock JWT token generator
export const generateMockToken = (role: UserRole = UserRole.MEMBER) => {
  // Create a mock payload
  const payload = {
    sub: "user123",
    name: "Test User",
    email: "test@example.com",
    picture: "https://ui-avatars.com/api/?name=Test+User&background=random",
    role: role,
    exp: Math.floor(Date.now() / 1000) + 3600, // Token expires in 1 hour
  };

  // In a real app, you would sign this with a secret key
  // For demo purposes, we'll just encode it to base64
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = btoa("mock_signature"); // Not a real signature

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

// Mock Google OAuth response
export const mockGoogleOAuthResponse = (role: UserRole = UserRole.MEMBER) => {
  return {
    credential: generateMockToken(role),
  };
};
