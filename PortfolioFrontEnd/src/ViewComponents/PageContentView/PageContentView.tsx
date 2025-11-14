import { Outlet } from "react-router-dom";
import "./PageContentView.css";
const PageContentView = () => {
  return (
    <div className="PageContentViewContainer">
      <Outlet />
    </div>
  );
};

export default PageContentView;
