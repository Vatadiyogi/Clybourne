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
import { formatToTwoDecimalPlaces } from "../../../utils/utility";
const CustomTooltip = ({ active, payload, label, unit }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md">
                <p className="font-semibold text-sm mb-1">{`Year: ${payload[0].payload.year}`}</p>
                <p className="text-sm text-gray-700">
                    <span className="font-medium">EBITDA: </span>
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
                            tickFormatter={(value) => formatToTwoDecimalPlaces(value)}
                        />
                        <YAxis
                            type="category"
                            dataKey="year"
                            axisLine={false}
                            tickLine={false}
                            width={50}
                            tick={{ fontSize: 10, fill: "#555" }}
                        />
                        {/* <Tooltip formatter={(value) => formatToTwoDecimalPlaces(value)} /> */}
                        <Tooltip
                            content={<CustomTooltip unit={unit} />}
                            cursor={{ fill: 'rgba(35, 57, 119, 0.1)' }}
                        />
                        <Bar dataKey="ebitda" fill="#233977" radius={[0, 3, 3, 0]}>
                            <LabelList
                                dataKey="ebitda"
                                position="right"
                                fill="#555"
                                fontSize={12}
                                formatter={(value) => formatToTwoDecimalPlaces(value)}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </fieldset>
        </div>
    );
}