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
              <Tooltip
                contentStyle={{ backgroundColor: "#233977", border: "none" }}
                itemStyle={{ color: "#fff" }}
                labelStyle={{ color: "#fff" }}
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