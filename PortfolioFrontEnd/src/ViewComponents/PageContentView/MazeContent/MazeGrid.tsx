import { useEffect, type FC } from "react";
import { generateMazeConfiguration } from "../../../utils";
interface MazeDimensions {
  width: number;
  height: number;
}

interface CellState {
  cellState: number;
  index: number;
}

// Editable CSS variables for the maze borders
const borderWidth = "1px";
const borderStyle = "solid";
const borderColor = "var(--mazeWallCellColour)";
const borderString = `${borderWidth} ${borderStyle} ${borderColor}`;

const cellStateToStyleObject: { [key: string]: React.CSSProperties } = {
  "0": { border: borderString },
  "1": { borderTop: borderString },
  "2": { borderRight: borderString },
  "3": {
    borderTop: borderString,
    borderRight: borderString,
  },
  "4": { borderBottom: borderString },
  "5": {
    borderTop: borderString,
    borderBottom: borderString,
  },
  "6": {
    borderRight: borderString,
    borderBottom: borderString,
  },
  "7": {
    borderTop: borderString,
    borderRight: borderString,
    borderBottom: borderString,
  },
  "8": { borderLeft: borderString },
  "9": {
    borderTop: borderString,
    borderLeft: borderString,
  },
  "10": {
    borderRight: borderString,
    borderLeft: borderString,
  },
  "11": {
    borderTop: borderString,
    borderRight: borderString,
    borderLeft: borderString,
  },
  "12": {
    borderBottom: borderString,
    borderLeft: borderString,
  },
  "13": {
    borderTop: borderString,
    borderBottom: borderString,
    borderLeft: borderString,
  },
  "14": {
    borderRight: borderString,
    borderBottom: borderString,
    borderLeft: borderString,
  },
  "15": { border: borderString },
};

const MazeCell: FC<CellState> = ({ cellState, index }) => {
  let cellLetterColour: string = cellState < 1 ? "white" : "black";
  let cellStyle = {
    color: cellLetterColour,
    ...cellStateToStyleObject[cellState],
  };
  return (
    <div className="MazeCell" style={cellStyle}>
      {cellState}
    </div>
  );
};

const MazeGrid: FC<MazeDimensions> = ({ height, width }) => {
  const mazeStyle = {
    gridTemplateColumns: `repeat(${width}, 1fr)`,
    gridTemplateRows: `repeat(${height}, 1fr)`,
  };
  let mazeConfiguration: number[] = generateMazeConfiguration(width * height);
  return (
    <div className="MazeGrid" style={mazeStyle}>
      {mazeConfiguration.map((cellState, index) => (
        <MazeCell key={index} cellState={cellState} index={index} />
      ))}
    </div>
  );
};

export default MazeGrid;
