"use client";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import GeneralButton from "../GeneralButton";
import { formatToTwoDecimalPlaces } from "../../../utils/utility";
const CustomTooltip = ({ active, payload, label, unit }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md">
        <p className="font-semibold text-sm mb-1">{`Year: ${payload[0].payload.year}`}</p>
        <p className="text-sm text-gray-700">
          <span className="font-medium">Net Margin: </span>
          <span className="text-themeblue">
            {formatToTwoDecimalPlaces(payload[0].value)} {unit}
          </span>
        </p>
        {/* You can add more custom content here */}
        {payload[0].payload.growth && (
          <p className="text-xs text-green-600 mt-1">
            Growth: {payload[0].payload.growth}%
          </p>
        )}
      </div>
    );
  }
  return null;
};
export default function NetMarginChart({ yearly }) {
  return (
    <div className="card p-0 rounded">
      <fieldset className="pt-8 pb-0 border border-gray-200 bg-white rounded-md">
        <legend className="m-auto">
          <GeneralButton
            content={"Net Profit Margin (%)"}
            className="bg-themeblue cursor-default text-sm text-white"
          />
        </legend>

        <div className="p-4">
          <ResponsiveContainer width="100%" height={206}>
            <AreaChart data={yearly}>
              <CartesianGrid vertical={false} horizontal={false} />
              <XAxis
                dataKey="year"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#555" }}
              />
              <YAxis hide />
              {/* <Tooltip
                contentStyle={{ backgroundColor: "#233977", border: "none" }}
                itemStyle={{ color: "#fff" }}
                labelStyle={{ color: "#fff" }}
                formatter={(value) => `${formatToTwoDecimalPlaces(value)}%`}
              /> */}
                 <Tooltip
                content={<CustomTooltip unit="%" />}
                cursor={{ stroke: '#233977', strokeWidth: 1 }}
              />
              
              <Area
                type="monotone"
                dataKey="netMargin"
                stroke="#233977"
                fill="rgba(35, 57, 119, 0.3)"
                strokeWidth={2}
                dot={{ fill: "#233977", strokeWidth: 2 }}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </fieldset>
    </div>
  );
}