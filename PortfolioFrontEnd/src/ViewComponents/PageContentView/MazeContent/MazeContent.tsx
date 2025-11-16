import "./MazeContent.css";
import MazeGrid from "./MazeGrid";
const MazeContent = () => {
  return (
    <div className="MazeViewContainer">
      <MazeGrid height={20} width={20} />
    </div>
  );
};
export default MazeContent;
