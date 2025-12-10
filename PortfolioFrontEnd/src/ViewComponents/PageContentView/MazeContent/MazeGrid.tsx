import { type FC, useState, useEffect } from "react";
import { generateRandomMazeConfiguration, generateMaze } from "../../../utils";
import MazeCell from "./MazeCell";
import { type MazeDimensions, type MazeCellInfo } from "./MazeInterfaces";

const handleGenerate = async (
  width: number,
  height: number,
  horizontalConnectivity: number
) => {
  const mazeResult = await generateMaze(width, height, horizontalConnectivity);
  return mazeResult.map((cellInfo) => ({
    state: cellInfo.state,
    isEndState: cellInfo.is_end,
    isStartState: cellInfo.is_start,
  }));
};

const MazeGrid: FC<MazeDimensions> = ({
  height,
  width,
  horizontalConnectivity,
}) => {
  const [mazeConfiguration, setMazeConfiguration] = useState<MazeCellInfo[]>(
    []
  );

  useEffect(() => {
    const generateMazeAsync = async () => {
      const configuration: MazeCellInfo[] = await handleGenerate(
        width,
        height,
        horizontalConnectivity
      );
      setMazeConfiguration(configuration);
    };
    generateMazeAsync();
  }, [width, height, horizontalConnectivity]);

  const mazeStyle = {
    gridTemplateColumns: `repeat(${width}, 1fr)`,
    gridTemplateRows: `repeat(${height}, 1fr)`,
  };

  return (
    <div className="MazeGrid " style={mazeStyle}>
      {mazeConfiguration.map((cellInfo, index) => (
        <MazeCell
          key={index}
          state={cellInfo.state}
          isEndState={cellInfo.isEndState}
          isStartState={cellInfo.isStartState}
        />
      ))}
    </div>
  );
};

export default MazeGrid;
