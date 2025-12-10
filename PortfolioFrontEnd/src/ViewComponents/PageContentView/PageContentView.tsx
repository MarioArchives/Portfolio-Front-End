import { Outlet } from "react-router-dom";
import "./PageContentView.css";
const PageContentView = () => {
  return (
    <div className="PageContentViewContainer">
      <div className="ContentView">
        <div className="ViewContainer">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PageContentView;
