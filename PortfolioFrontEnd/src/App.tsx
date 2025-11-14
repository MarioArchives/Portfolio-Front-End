import { useState } from "react";
import "./App.css";
import { PageView } from "./ViewComponents/PageView/PageView";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PageView />} />
      </Routes>
    </Router>
  );
}

export default App;
