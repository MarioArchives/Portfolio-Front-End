import "./App.css";
import { Layout } from "./ViewComponents/PageView/Layout";
import MazeContent from "./ViewComponents/PageContentView/MazeContent/MazeContent";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./ViewComponents/PageContentView/NotFound/NotFound";
import PlotContentView from "./ViewComponents/PageContentView/PlotsContent/Plots";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/Maze" element={<MazeContent />} />
          <Route path="/Plots" element={<PlotContentView />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
