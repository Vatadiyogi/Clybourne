"use client";
import { ResponsiveContainer, LabelList, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import GeneralButton from "../GeneralButton";
import { formatToTwoDecimalPlaces } from "../../../utils/utility";
const CustomTooltip = ({ active, payload, label, unit }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md">
                <p className="font-semibold text-sm mb-1">{`Year: ${payload[0].payload.year}`}</p>
                <p className="text-sm text-gray-700">
                    <span className="font-medium">Sales: </span>
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
export default function SalesChart({ yearly, unit }) {
    return (
        <div className="card p-0 rounded">
            <fieldset className='pt-8 pb-4 border bg-white border-gray-200 rounded-md'>
                <legend className='m-auto'>
                    <GeneralButton content={`Sales (${unit})`} className="bg-themeblue cursor-default text-sm text-white" />
                </legend>

                <ResponsiveContainer width="100%" height={220}>
                    <BarChart 
                        width={500} 
                        isAnimationActive={false}
                        height={300} 
                        data={yearly} 
                        barCategoryGap="30%"
                        barGap={5}
                         margin={{
                            top: 30,
                            right: 10,
                            left: 10,
                            // bottom: 30,
                        }}
                    >
                        <XAxis 
                            dataKey="year"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: "#555" }}
                        />
                        {/* <Tooltip formatter={(value) => formatToTwoDecimalPlaces(value)} /> */}
                        <Tooltip 
                            content={<CustomTooltip unit={unit} />}
                            cursor={{ fill: 'rgba(35, 57, 119, 0.1)' }}
                        />
                        {/* <Legend wrapperStyle={{ fontSize: "14px", fontFamily: "Arial", boxShadow: "none" }} /> */}
                        <Bar dataKey="salesMain" stackId="a" fill="#233977" >
                             <LabelList
                                dataKey="salesMain"
                                position="top"
                                fill="#555"
                                fontSize={12}
                                formatter={(value) => formatToTwoDecimalPlaces(value)}
                            />
                        </Bar>
                        {/* <Bar
                            dataKey="salesExtra"
                            stackId="a"
                            fill="#7fb3ff"
                            radius={[3, 3, 0, 0]}
                            isAnimationActive={false}
                        >
                            <LabelList
                                dataKey="salesExtra"
                                content={(props) => {
                                    const { x, y, width, value } = props;
                                    if (value === 0) return null;
                                    return (
                                        <text
                                            x={x + width / 2}
                                            y={y - 5}
                                            textAnchor="middle"
                                            fill="#555"
                                            fontSize={12}
                                        >
                                            {value}
                                        </text>
                                    );
                                }}
                            />
                        </Bar> */}
                    </BarChart>
                </ResponsiveContainer>
            </fieldset>
        </div>
    );
}