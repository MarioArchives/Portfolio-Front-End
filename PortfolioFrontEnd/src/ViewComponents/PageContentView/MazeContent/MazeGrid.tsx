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

const MazeCell: FC<CellState> = ({ cellState, index }) => {
  let cellColour: String =
    cellState > 0 ? "var(--mazePathCellColour)" : "var(--mazeWallCellColour)";
  let cellLetterColour: String = cellState < 1 ? "white" : "black";
  let cellStyle = {
    backgroundColor: `${cellColour}`,
    color: `${cellLetterColour}`,
  };
  return <div className="MazeCell" style={cellStyle}></div>;
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
