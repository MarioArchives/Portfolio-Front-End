import { type FC, useState, useEffect } from "react";
import { generateRandomMazeConfiguration, generateMaze } from "../../../utils";
import MazeCell from "./MazeCell";

interface MazeDimensions {
  width: number;
  height: number;
}
const handleGenerate = async (width: number, height: number) => {
  const mazeResult = await generateMaze(width, height);
  return mazeResult.map((cellInfo) => cellInfo.state);
};

const MazeGrid: FC<MazeDimensions> = ({ height, width }) => {
  const [mazeConfiguration, setMazeConfiguration] = useState<number[]>([]);

  useEffect(() => {
    const generateMazeAsync = async () => {
      const configuration = await handleGenerate(width, height);
      setMazeConfiguration(configuration);
    };
    generateMazeAsync();
  }, [width, height]);

  const mazeStyle = {
    gridTemplateColumns: `repeat(${width}, 1fr)`,
    gridTemplateRows: `repeat(${height}, 1fr)`,
  };

  return (
    <div className="MazeGrid" style={mazeStyle}>
      {mazeConfiguration.map((cellState, index) => (
        <MazeCell key={index} cellState={cellState} index={index} />
      ))}
    </div>
  );
};

export default MazeGrid;
