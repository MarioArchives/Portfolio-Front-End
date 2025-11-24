import "./MazeContent.css";
import MazeGrid from "./MazeGrid";
const MazeContent = () => {
  const size = 100;
  return (
    <div className="MazeViewContainer">
      <MazeGrid height={size} width={size} />
    </div>
  );
};

export default MazeContent;
