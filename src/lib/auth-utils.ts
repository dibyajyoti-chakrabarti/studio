/**
 * Centralized list of administrative emails.
 * In a production environment, this might come from environment variables or a specific Firestore collection.
 */
export const ADMIN_EMAILS = [
  'divyanshu.work914214@gmail.com',
  'outreach@mechhub.in',
  'admin@mechhub.in',
  // Add other admin emails here
];

/**
 * Checks if a given email belongs to an administrative account.
 * @param email The email to check
 * @returns boolean
 */
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
