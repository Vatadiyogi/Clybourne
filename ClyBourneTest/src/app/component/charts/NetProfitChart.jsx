"use client";
import {
    ResponsiveContainer,
    LabelList,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend,
} from "recharts";
import GeneralButton from "../GeneralButton";

export default function NetProfitChart({ yearly, unit }) {
    return (
        <div className="card p-0 rounded">
            <fieldset className="pt-2 border h-[304px] flex justify-center bg-white items-center border-gray-200 rounded-md">
                <legend className="m-auto">
                    <GeneralButton
                        content={`Net Profit (${unit})`}
                        className="bg-themeblue cursor-default text-sm text-white"
                    />
                </legend>

                <ResponsiveContainer width="100%" height={230}>
                    <BarChart
                    
                        data={yearly}
                        layout="vertical"
                        barCategoryGap="20%"
                        barGap={5}
                        isAnimationActive={false}
                        margin={{ top: 0, right: 50, bottom: 0, left: 0 }}
                    >
                        <XAxis
                            type="number"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: "#555" }}
                        />
                        <YAxis
                            type="category"
                            dataKey="year"
                            axisLine={false}
                            tickLine={false}
                            width={50}
                            tick={{ fontSize: 10, fill: "#555" }}
                        />
                        <Tooltip />
                        <Bar dataKey="netProfit" fill="#233977" radius={[0, 3, 3, 0]} >
                            <LabelList
                                dataKey="netProfit"
                                position="right"
                                fill="#555"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </fieldset>
        </div>
    );
}