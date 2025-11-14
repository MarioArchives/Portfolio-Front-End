import "./HeadderButton.css";

interface HeadderButtonProps {
  text: string;
}

const handleClick = (text: string) => {
  console.log(`Button ${text} has been clicked`);
};

const HeadderButton = ({ text }: HeadderButtonProps) => {
  return (
    <button className="HeadderButton" onClick={() => handleClick(text)}>
      <p>{text}</p>
    </button>
  );
};
export default HeadderButton;
