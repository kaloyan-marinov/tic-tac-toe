export const validateCoordinate = (coordinate: number) => {
  if (0 <= coordinate && coordinate <= 2) {
    return true;
  }
  return false;
};
