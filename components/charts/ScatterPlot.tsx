"use client";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface DataPoint {
  name: string;
  sdt: number;
  fte: number;
  department: string;
}

interface ScatterPlotProps {
  data: DataPoint[];
}

const DEPT_COLORS: Record<string, string> = {
  Engineering: "#6366f1",
  "HR & People": "#14b8a6",
  Marketing: "#f59e0b",
  Finance: "#ef4444",
};

export function WorkloadScatterPlot({ data }: ScatterPlotProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis
          type="number"
          dataKey="sdt"
          name="SDT Index"
          domain={[0, 100]}
          label={{ value: "SDT Index (%)", position: "insideBottom", offset: -5, fontSize: 11 }}
          tick={{ fontSize: 11 }}
        />
        <YAxis
          type="number"
          dataKey="fte"
          name="FTE"
          domain={[0, 2]}
          label={{ value: "FTE", angle: -90, position: "insideLeft", fontSize: 11 }}
          tick={{ fontSize: 11 }}
        />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          content={({ payload }) => {
            if (!payload?.length) return null;
            const d = payload[0].payload as DataPoint;
            return (
              <div className="bg-white border border-gray-200 rounded-lg p-3 shadow text-xs">
                <p className="font-bold text-gray-800">{d.name}</p>
                <p className="text-gray-500">{d.department}</p>
                <p>SDT: <span className="font-medium text-indigo-600">{d.sdt.toFixed(1)}%</span></p>
                <p>FTE: <span className="font-medium text-amber-600">{d.fte.toFixed(2)}</span></p>
              </div>
            );
          }}
        />
        {/* Risk zones */}
        <ReferenceLine y={1.3} stroke="#ef4444" strokeDasharray="4 2" label={{ value: "Overload", fontSize: 10, fill: "#ef4444" }} />
        <ReferenceLine x={60} stroke="#f59e0b" strokeDasharray="4 2" label={{ value: "SDT < 60%", fontSize: 10, fill: "#f59e0b" }} />

        {Object.entries(DEPT_COLORS).map(([dept, color]) => (
          <Scatter
            key={dept}
            name={dept}
            data={data.filter((d) => d.department === dept)}
            fill={color}
          />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
}
