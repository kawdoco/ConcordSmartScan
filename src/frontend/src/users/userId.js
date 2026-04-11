const USER_PREFIX = "UID-";

const extractNumericPart = (value) => {
  if (value === null || value === undefined || value === "" || value === "-") {
    return null;
  }

  const match = String(value).trim().match(/(\d+)$/);
  if (!match) {
    return null;
  }

  const parsed = Number(match[1]);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
};

export const formatUserId = (value) => {
  const numericId = extractNumericPart(value);
  if (numericId === null) {
    return "-";
  }

  return `${USER_PREFIX}${String(numericId).padStart(3, "0")}`;
};
