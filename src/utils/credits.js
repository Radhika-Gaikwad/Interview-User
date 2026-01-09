export const MINUTES_TO_CREDITS = {
  30: 0.5,
  60: 1,
};

export const creditsFromMinutes = (minutes) => {
  if (!MINUTES_TO_CREDITS[minutes]) {
    throw new Error("Invalid interview duration");
  }
  return MINUTES_TO_CREDITS[minutes];
};
