import { useState } from "react";
import "./App.css";
import { PageView } from "./ViewComponents/PageView/PageView";

function App() {
  const [count, setCount] = useState(0);

  return <PageView />;
}

export default App;
