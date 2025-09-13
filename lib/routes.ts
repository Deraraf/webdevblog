export const publicRoutes = [
  "/",
  "/email-verification",
  "/password-email-form",
  "/password-reset-form",
  "/blog/feed/1",
  "/blog/:id",
  /^\/blog\/feed\/d+$/,
  /^\/blog\/details\/[\w-]+$/,
];
export const authRoutes = ["/login", "/register"];
export const apiAuthPrifix = "/api/auth";
export const LOGIN_REDIRECT = "/blog/feed/1";
