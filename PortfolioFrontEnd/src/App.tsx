import "./App.css";
import { Layout } from "./ViewComponents/PageView/Layout";
import MazeContent from "./ViewComponents/PageContentView/MazeContent/MazeContent";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/Maze" element={<MazeContent />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
