import "./MazeContent.css";
import MazeGrid from "./MazeGrid";
const MazeContent = () => {
  const size = 20;
  return (
    <div className="MazeViewContainer">
      <MazeGrid height={size} width={size} horizontalConnectivity={50} />
    </div>
  );
};

export default MazeContent;
