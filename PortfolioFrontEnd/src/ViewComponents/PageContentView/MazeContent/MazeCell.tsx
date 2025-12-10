import { useEffect, type FC } from "react";
import { type MazeCellInfo } from "./MazeInterfaces";

const borderWidth = "var(--mazeCellBorderSize)";
const borderStyle = "solid";
const borderColor = "var(--mazeWallCellColour)";
const borderString = `${borderWidth} ${borderStyle} ${borderColor}`;

const cellStateToStyleObject: { [key: string]: React.CSSProperties } = {
  "0": { border: borderString },
  "1": {
    borderTop: borderString,
    borderLeft: borderString,
    borderRight: borderString,
  },
  "2": {
    borderTop: borderString,
    borderBottom: borderString,
    borderLeft: borderString,
  },
  "3": { borderTop: borderString, borderLeft: borderString },
  "4": {
    borderBottom: borderString,
    borderLeft: borderString,
    borderRight: borderString,
  },
  "5": { borderLeft: borderString, borderRight: borderString },
  "6": { borderBottom: borderString, borderLeft: borderString },
  "7": { borderLeft: borderString },
  "8": {
    borderTop: borderString,
    borderBottom: borderString,
    borderRight: borderString,
  },
  "9": { borderTop: borderString, borderRight: borderString },
  "10": { borderTop: borderString, borderBottom: borderString },
  "11": { borderTop: borderString },
  "12": { borderBottom: borderString, borderRight: borderString },
  "13": { borderRight: borderString },
  "14": { borderBottom: borderString },
  "15": {},
};

const MazeCell: FC<MazeCellInfo> = ({ state, isEndState, isStartState }) => {
  let cellClassNames = isEndState == 1 ? "ExitCell" : "";
  cellClassNames += isStartState == 1 ? " StartCell" : "";

  let cellStyle = {
    ...cellStateToStyleObject[state],
  };
  return <div className={`MazeCell ${cellClassNames}`} style={cellStyle}></div>;
};

export default MazeCell;
