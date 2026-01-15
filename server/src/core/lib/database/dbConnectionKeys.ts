// dbConnectionKeys.ts
/**
 * Central registry for MongoDB connection keys.
 *
 * Rules:
 * - Do NOT hardcode connection keys elsewhere
 * - Do NOT change keys casually (breaking change)
 * - Keys are logical identifiers, NOT security controls
 */

export const DB_CONN_KEYS = {
  // Auth database
  AUTH_ALL_F: "auth_all_f",
  AUTH_ALL_FUI: "auth_all_fui",

  // Site database
  SITE_ALL_RW: "site_all_rw",

  // Portfolio database
  PORTFOLIO_ALL_RW: "portfolio_all_rw",
} as const;

/**
 * Union type of all allowed connection keys.
 * Used to enforce type safety across the app.
 */
export type DbConnectionKey = (typeof DB_CONN_KEYS)[keyof typeof DB_CONN_KEYS];
