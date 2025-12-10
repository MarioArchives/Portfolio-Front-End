
import "./HeadderButton.css";
import { Link } from "react-router-dom";

interface HeadderButtonProps {
  text: string;
}

const textToPage: { [key: string]: string } = {
  Home: "/",
  Maze: "/Maze",
  Plots: "/Plots",
};

const handleClick = (text: string) => {
  console.log(`Button ${text} has been clicked`);
};

const HeadderButton = ({ text }: HeadderButtonProps) => {
  const linkToPage = textToPage[text] ?? "/YouSeemLost";
  return (
    <button className="HeadderButton" onClick={() => handleClick(text)}>
      <Link className="HeadderButtonLink" to={`${linkToPage}`}>
        <p>{text}</p>
      </Link>
    </button>
  );
};
export default HeadderButton;
