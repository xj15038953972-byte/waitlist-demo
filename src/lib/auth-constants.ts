export const SESSION_COOKIE = "waitlist_session";

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export type AuthUser = {
  id: string;
  username: string;
};
