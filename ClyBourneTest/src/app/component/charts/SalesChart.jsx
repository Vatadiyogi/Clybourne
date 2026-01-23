"use client";
import { ResponsiveContainer, LabelList, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import GeneralButton from "../GeneralButton";

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
                        <Tooltip />
                        {/* <Legend wrapperStyle={{ fontSize: "14px", fontFamily: "Arial", boxShadow: "none" }} /> */}
                        <Bar dataKey="salesMain" stackId="a" fill="#233977" >
                             <LabelList
                                dataKey="salesMain"
                                position="top"
                                fill="#555"
                                fontSize={12}
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