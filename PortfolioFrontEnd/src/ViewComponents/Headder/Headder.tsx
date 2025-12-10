import "./Headder.css";
import HeadderButton from "./HeadderButton/HeadderButton";
const Headder = () => {
  //To update the link also update the dictionary in HeadderButtons
  const headerList: string[] = ["About", "Maze", "Contact", "Home", "Plots"];
  return (
    <div className="HeadderContainer">
      <div className="HeadderListItems">
        {headerList.map((item, index) => (
          <HeadderButton key={index} text={item} />
        ))}
      </div>
    </div>
  );
};

export default Headder;
