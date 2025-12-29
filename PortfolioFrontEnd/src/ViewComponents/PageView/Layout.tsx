import "./Layout.css";
import "./Layout.scss";
import Headder from "../Headder/Headder";
import PageContentView from "../PageContentView/PageContentView";

const generateShootingStar = (index: number) => {
    // Random starting position (off-screen)
    const startSide = Math.random() > 0.5 ? 'top' : 'left';

    let startX, startY, endX, endY;

    if (startSide === 'top') {
        // Start from top, shoot diagonally down
        startX = Math.random() * 120 - 10; // -10vw to 110vw
        startY = -20; // Above screen
        endX = startX + (Math.random() * 60 + 40) * (Math.random() > 0.5 ? 1 : -1); // Move 40-100vw
        endY = 120; // Below screen
    } else {
        // Start from left/right, shoot diagonally
        startX = Math.random() > 0.5 ? -20 : 120;
        startY = Math.random() * 120 - 10;
        endX = startX > 0 ? -20 : 120;
        endY = startY + (Math.random() * 60 + 40) * (Math.random() > 0.5 ? 1 : -1);
    }

    return {
        '--start-x': `${startX}vw`,
        '--start-y': `${startY}vh`,
        '--end-x': `${endX}vw`,
        '--end-y': `${endY}vh`,
        '--duration': `${Math.random() * 3 + 7}s`, // 2-5 seconds
        '--delay': `${Math.random() * 10}s`, // 0-10s delay
        '--flash-delay': `${Math.random() * 8000 + 500}ms`, // 0.5-8.5s

    } as React.CSSProperties;
};

export const Layout = () => {
    const numFireflies = 15;

    return (
        <div className="PageLayout">
            {[...Array(numFireflies)].map((_, i) => (
                <div
                    key={i}
                    className="shooting-star"
                    style={generateShootingStar(i)}
                />
            ))}

            <Headder />
            <PageContentView />
        </div>
    );
};
