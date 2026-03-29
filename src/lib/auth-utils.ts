/**
 * Checks if a user has administrative privileges based on Firebase Custom Claims.
 * This is the secure, recommended way to handle roles.
 * 
 * @param claims The decoded ID token claims from Firebase Admin or ID Token Result from Client
 * @returns boolean
 */
export function checkIsAdmin(claims: any): boolean {
  return !!claims?.admin;
}

/**
 * Legacy/Fallback: Checks if a given email belongs to an administrative account.
 * WARNING: This is less secure than custom claims and should only be used 
 * as a secondary validation during initial onboarding or in specific admin scripts.
 * 
 * @param email The email to check
 * @returns boolean
 */
export const ADMIN_EMAILS = [
  'divyanshu.work914214@gmail.com',
  'outreach@mechhub.in',
  'admin@mechhub.in',
  // Add other admin emails here
];

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
