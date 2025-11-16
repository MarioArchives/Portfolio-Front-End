export const generateMazeConfiguration = (size: number): number[] => {
  return Array.from({ length: size }, () => Math.round(Math.random()));
};
