import { useEffect, useState } from "react";
import MazeGrid from "./MazeGrid";

import "./MazeContent.css";

const MazeContent = () => {
  const size = 20;
  const [value, setValue] = useState(50);

  return (
    <>
      <h1>Eller's Maze</h1>
      <MazeGrid height={size} width={size} horizontalConnectivity={value} />
      <div className="MazeSliderContainer">
        <p>Horizontality: {value}</p>
        <label>
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
          />
        </label>
      </div>
    </>
  );
};

export default MazeContent;
