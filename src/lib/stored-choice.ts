/** Read a remembered choice from this browser, returning "" when storage is unavailable or the value is invalid. */
export const loadStoredChoice = (key: string, isValid: (value: string) => boolean): string => {
  try {
    const value = localStorage.getItem(key) ?? "";
    return isValid(value) ? value : "";
  } catch {
    return "";
  }
};

/** Remember a choice for the next visit. Private browsing may block storage, so failures are ignored. */
export const saveStoredChoice = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Storage is optional; the selection still works for this session. */
  }
};
