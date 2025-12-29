import "./NotFound.css"

const NotFound = () => {
  return (
    <div className="ContentView NotFoundView">
      <div className="ViewContainer NotFoundPanel">
        <div className="NotFoundCode">404</div>
        <p className="NotFoundMessage">TRANSMISSION LOST</p>
        <p className="NotFoundSubtext">
          The requested sector does not exist in this star map.
        </p>
      </div>
    </div>
  );
};

export default NotFound;

