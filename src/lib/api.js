export const API_BASE = process.env.REACT_APP_API_URL || "/api";
export async function api(path, options = {}) {
  let response;
  try {
    response = await fetch(API_BASE + path, {
      credentials: "include",
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    });
  } catch {
    throw new Error(
      "We couldn’t reach the studio server. Please try again later.",
    );
  }
  const type = response.headers.get("content-type") || "";
  if (!type.includes("application/json"))
    throw new Error(
      "The studio server is unavailable. Please try again later.",
    );
  const body = await response.json();
  if (!response.ok)
    throw new Error(body.error || "Something went wrong. Please try again.");
  return body;
}
export function safeImage(url) {
  return typeof url === "string" &&
    (url.startsWith("/images/") ||
      url.startsWith("/uploads/") ||
      /^https:\/\//i.test(url))
    ? url
    : "";
}
export function videoEmbed(url) {
  try {
    const u = new URL(url);
    if (["www.youtube.com", "youtube.com"].includes(u.hostname)) {
      const id = u.searchParams.get("v");
      if (/^[\w-]{11}$/.test(id || ""))
        return "https://www.youtube-nocookie.com/embed/" + id;
    }
    if (u.hostname === "youtu.be" && /^\/[\w-]{11}$/.test(u.pathname))
      return "https://www.youtube-nocookie.com/embed" + u.pathname;
    if (
      ["vimeo.com", "www.vimeo.com"].includes(u.hostname) &&
      /^\/\d+$/.test(u.pathname)
    )
      return "https://player.vimeo.com/video" + u.pathname;
  } catch {}
  return "";
}
