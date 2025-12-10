export interface MazeDimensions {
  width: number;
  height: number;
  horizontalConnectivity: number;
}
export interface MazeCellInfo {
  state: number;
  isEndState: number;
  isStartState: number;
}