export const ACCESSS_TOKEN_URI = "https://oauth2.googleapis.com/token";
export const REFRESH_TOKEN_URI = "https://oauth2.googleapis.com/token";
export const REVOKE_TOKEN_URI = "https://oauth2.googleapis.com/revoke";
export const AUTH_URI = "https://accounts.google.com/o/oauth2/auth";
export const REDIRECT_URI = `${process.env.SERVER_URL as string}/api/users/google-oauth-callback`;
