// Return timestamp as timestamp in seconds (number)
export const strToTimestamp = (timestamp: string): number => {
  // Timestamp formatted as MM:SS
  // Split between colon to get MM and SS
  const times = timestamp.split(":");
  const minutes = Number(times[0]);
  const seconds = Number(times[1]);

  // MM * 60 = MM in seconds
  return minutes * 60 + seconds;
};
