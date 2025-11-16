import "./Layout.css";
import Headder from "../Headder/Headder";
import PageContentView from "../PageContentView/PageContentView";
export const Layout = () => {
  return (
    <div className="PageLayout">
      <Headder />
      <PageContentView />
    </div>
  );
};
