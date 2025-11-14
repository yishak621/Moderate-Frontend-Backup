/**
 * ws:// (development) and wss:// (production)
 *  http:// or https://
 */

export const getSocketUrl = (): string => {
  if (process.env.NODE_ENV === "development") {
    return (
      process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8000/api/messages"
    );
  }

 
  if (process.env.NEXT_PUBLIC_WS_URL) {
    return process.env.NEXT_PUBLIC_WS_URL;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl) {
    const baseUrl = apiUrl.replace(/\/$/, "");
    return `${baseUrl}/api/messages`;
  }

  return "/api/messages";
};
