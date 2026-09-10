// =========================================================
// GET FIRST WORD
// =========================================================

export const getFirstWord = (value) => {
  if (!value) return "";

  return value.trim().split(/\s+/)[0];
};

// =========================================================
// LOWERCASE
// =========================================================

export const toLowerCase = (value) => {
  if (!value) return "";

  return value.toLowerCase();
};

// =========================================================
// UPPERCASE
// =========================================================

export const toUpperCase = (value) => {
  if (!value) return "";

  return value.toUpperCase();
};

// =========================================================
// TITLE CASE
// Every word starts with uppercase
// =========================================================

export const toTitleCase = (value) => {
  if (!value) return "";

  return value
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

// =========================================================
// SMART TITLE CASE
// Small connecting words remain lowercase
// =========================================================

export const toSmartTitleCase = (value) => {
  if (!value) return "";

  const smallWords = new Set([
    "a",
    "is",
    "an",
    "and",
    "as",
    "at",
    "by",
    "for",
    "from",
    "in",
    "of",
    "on",
    "or",
    "the",
    "to",
    "with",
  ]);

  return value
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .map((word, index) => {
      if (index !== 0 && smallWords.has(word)) {
        return word;
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

// =========================================================
// SENTENCE CASE
// Capitalizes the first letter of each sentence
// =========================================================
export const toSentenceCase = (value) => {
  if (!value) return "";

  const trailingSpace = /\s$/.test(value);

  const formatted = value
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s+\w)/g, (match) => match.toUpperCase());

  return trailingSpace ? `${formatted} ` : formatted;
};

// =========================================================
// GET INITIALS
// Extracts the initials from a name
// =========================================================
export const getInitials = (name) => {
  if (!name) return "";

  return name
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};
