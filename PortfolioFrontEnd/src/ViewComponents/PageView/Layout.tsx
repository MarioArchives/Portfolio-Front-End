import "./Layout.css";
import Headder from "../Headder/Headder";
import PageContentView from "../PageContentView/PageContentView";
export const PageView = () => {
  return (
    <div className="PageViewComponent">
      <Headder />
      <PageContentView />
    </div>
  );
};
