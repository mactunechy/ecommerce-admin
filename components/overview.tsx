"use client";
import { ResponsiveContainer, Bar, BarChart, XAxis, YAxis } from "recharts";

interface Props {
  data: any[];
}

const Overview: React.FC<Props> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#000000"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#000000"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `R${value}`}
        />
        <Bar dataKey="total" fill="#3498db" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Overview;
