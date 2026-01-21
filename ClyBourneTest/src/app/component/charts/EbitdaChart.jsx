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

export default function EbitdaChart({ yearly, unit }) {
    return (
        <div className="card p-0 rounded">
            <fieldset className="pt-2 border h-[304px] bg-white flex justify-center items-center border-gray-200 rounded-md">
                <legend className="m-auto">
                    <GeneralButton
                        content={`EBITDA (${unit})`}
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
                        margin={{ top: 0, right: 40, bottom: 0, left: 0 }}
                        //  padding={{ top: 0, right: 0, bottom: 0, left: 20 }}
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
                        <Bar dataKey="ebitda" fill="#233977" radius={[0, 3, 3, 0]}>
                            <LabelList
                                dataKey="ebitda"
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