import { useEffect, type FC } from "react";
interface CellState {
  cellState: number;
  index: number;
}

// Editable CSS variables for the maze borders
const borderWidth = "1px";
const borderStyle = "solid";
const borderColor = "var(--mazeWallCellColour)";
const borderString = `${borderWidth} ${borderStyle} ${borderColor}`;

// Cell states sorted by LURD binary format (Left, Up, Right, Down)
// 0000 = 0: no paths (solid walls) - "x"
// 0001 = 1: down only - "↓"
// 0010 = 2: right only - "→"
// 0011 = 3: right + down - "┏"
// 0100 = 4: up only - "↑"
// 0101 = 5: up + down - "┃"
// 0110 = 6: up + right - "┗"
// 0111 = 7: up + right + down - "┣"
// 1000 = 8: left only - "←"
// 1001 = 9: left + down - "┓"
// 1010 = 10: left + right - "━"
// 1011 = 11: left + right + down - "┳"
// 1100 = 12: left + up - "┛"
// 1101 = 13: left + up + down - "┫"
// 1110 = 14: left + up + right - "┻"
// 1111 = 15: all directions - "╋"
const cellStateToStyleObject: { [key: string]: React.CSSProperties } = {
  "0": { border: borderString }, // no paths
  "1": {
    borderTop: borderString,
    borderLeft: borderString,
    borderRight: borderString,
  }, // down only
  "2": {
    borderTop: borderString,
    borderBottom: borderString,
    borderLeft: borderString,
  }, // right only
  "3": { borderTop: borderString, borderLeft: borderString }, // right + down
  "4": {
    borderBottom: borderString,
    borderLeft: borderString,
    borderRight: borderString,
  }, // up only
  "5": { borderLeft: borderString, borderRight: borderString }, // up + down
  "6": { borderBottom: borderString, borderLeft: borderString }, // up + right
  "7": { borderLeft: borderString }, // up + right + down
  "8": {
    borderTop: borderString,
    borderBottom: borderString,
    borderRight: borderString,
  }, // left only
  "9": { borderTop: borderString, borderRight: borderString }, // left + down
  "10": { borderTop: borderString, borderBottom: borderString }, // left + right
  "11": { borderTop: borderString }, // left + right + down
  "12": { borderBottom: borderString, borderRight: borderString }, // left + up
  "13": { borderRight: borderString }, // left + up + down
  "14": { borderBottom: borderString }, // left + up + right
  "15": {}, // all directions - no borders (open path)
};

const MazeCell: FC<CellState> = ({ cellState }) => {
  let cellLetterColour: string = cellState < 1 ? "white" : "black";
  let cellStyle = {
    color: cellLetterColour,
    ...cellStateToStyleObject[cellState],
  };
  return <div className="MazeCell" style={cellStyle}></div>;
};

export default MazeCell;
