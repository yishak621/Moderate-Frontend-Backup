/**
 * Ensures a URL uses HTTPS protocol
 * This is needed to fix Mixed Content errors when the frontend is served over HTTPS
 * but the API returns HTTP URLs
 */
export function ensureHttps(url: string | undefined | null): string {
  if (!url) return "";
  
  // If the URL starts with http://, replace with https://
  if (url.startsWith("http://")) {
    return url.replace("http://", "https://");
  }
  
  // If it's already https:// or a relative URL, return as is
  return url;
}

