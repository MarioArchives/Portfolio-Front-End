import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect } from "react";

import "./Plots.css";
import { testMazeSpeed } from "../../../utils";

const handleTestMazeSpeed = async (method: number, size: number) => {
  const MazeTimeTaken: number = await testMazeSpeed(method, size);
  return MazeTimeTaken;
};

const PlotContentView = () => {
  const data = [
    { name: "Jan", sales: 4000, costs: 2400 },
    { name: "Feb", sales: 3000, costs: 1398 },
    { name: "Mar", sales: 2000, costs: 9800 },
    { name: "Apr", sales: 2780, costs: 3908 },
    { name: "May", sales: 1890, costs: 4800 },
  ];
  const lineWidth: number = 5;
  useEffect(() => {
    // run once on mount
    (async () => {
      try {
        // keep argument order consistent: (method, size)
        const result = await handleTestMazeSpeed(0, 10);
        console.log("Maze time taken:", result);
      } catch (err) {
        console.error("Error running testMazeSpeed:", err);
      }
    })();
  }, []);
  return (
    <>
      <h1>Information Plots</h1>
      <LineChart width={800} height={500} data={data}>
        <XAxis stroke="var(--space-dark)" strokeWidth={3} dataKey="name" />
        <YAxis stroke="var(--space-dark)" strokeWidth={3} />
        <Tooltip />
        <Legend />
        <Line
          strokeWidth={lineWidth}
          dot={false}
          type="monotone"
          dataKey="sales"
          stroke={`var(--globalYellow)`}
        />
        <Line
          strokeWidth={lineWidth}
          dot={false}
          type="monotone"
          dataKey="costs"
          stroke="var(--globalWhite)"
        />
      </LineChart>
    </>
  );
};
export default PlotContentView;
