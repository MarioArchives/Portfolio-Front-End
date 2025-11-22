import "./MazeContent.css";
import MazeGrid from "./MazeGrid";
const MazeContent = () => {
  return (
    <div className="MazeViewContainer">
      <MazeGrid height={100} width={100} />
    </div>
  );
};

export default MazeContent;
