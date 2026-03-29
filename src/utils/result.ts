// ═══════════════════════════════════════════════════
// Result<T, E> — Discriminated union for error handling
// NEVER throw across module boundaries. Return ok()/err().
// ═══════════════════════════════════════════════════

export type Result<T, E = Error> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E };

export function ok<T>(data: T): Result<T, never> {
  return { success: true, data };
}

export function err<E>(error: E): Result<never, E> {
  return { success: false, error };
}

export function isOk<T, E>(result: Result<T, E>): result is { success: true; data: T } {
  return result.success === true;
}

export function isErr<T, E>(result: Result<T, E>): result is { success: false; error: E } {
  return result.success === false;
}

/**
 * Unwraps a Result<T, E>, returning the data if success,
 * or throwing the error (use only at top-level boundaries like API routes).
 */
export function unwrap<T, E>(result: Result<T, E>): T {
  if (result.success) {
    return result.data;
  }
  throw result.error;
}
