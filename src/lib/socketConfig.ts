/**
 * WebSocket/Socket.IO Configuration
 * Supports both development and production environments
 *
 * Socket.IO automatically handles ws:// (development) and wss:// (production)
 * based on whether the URL uses http:// or https://
 */

export const getSocketUrl = (): string => {
  // Development environment
  if (process.env.NODE_ENV === "development") {
    // Use environment variable for dev WebSocket URL, or fallback to localhost
    return (
      process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8000/api/messages"
    );
  }

  // Production environment
  // Option 1: Use explicit WebSocket URL from environment variable
  if (process.env.NEXT_PUBLIC_WS_URL) {
    return process.env.NEXT_PUBLIC_WS_URL;
  }

  // Option 2: Derive from API URL
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl) {
    // Socket.IO works with http/https URLs and handles ws/wss automatically
    // Use https:// in production so Socket.IO uses wss://
    const baseUrl = apiUrl.replace(/\/$/, ""); // Remove trailing slash
    return `${baseUrl}/api/messages`;
  }

  // Fallback: relative path (Socket.IO will use current host)
  return "/api/messages";
};
