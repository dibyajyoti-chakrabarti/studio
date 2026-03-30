export function isPartNameValid(partName: string): boolean {
  const trimmed = partName.trim();
  if (!trimmed) return false;

  // Must include at least one letter so numeric-only names are rejected.
  return /[A-Za-z]/.test(trimmed);
}

