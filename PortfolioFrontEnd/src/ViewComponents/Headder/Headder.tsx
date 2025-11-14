import "./Headder.css";
import HeadderButton from "./HeadderButton/HeadderButton";
const Headder = () => {
  const headerList: string[] = ["About", "Projects", "Contact"];
  return (
    <div className="HeadderContainer">
      <div className="HeadderListItems">
        {headerList.map((item, index) => (
          <HeadderButton key={item} text={item} />
        ))}
      </div>
    </div>
  );
};

export default Headder;
