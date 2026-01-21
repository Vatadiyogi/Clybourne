"use client";
import { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HC_map from "highcharts/modules/map.js";
import worldMap from "@highcharts/map-collection/custom/world.geo.json";
import GeneralButton from "../GeneralButton";
import { getCountryName } from "../../../utils/countryUtils";

if (typeof HC_map === "function") {
    HC_map(Highcharts);
} else if (HC_map?.default) {
    HC_map.default(Highcharts);
}

export default function GeoMap({ selectedCountry, classes = "w-full", height  }) {
    console.log("Selected country code:", selectedCountry);

    // Get country name from code
    const countryName = getCountryName(selectedCountry);
    console.log("Country name:", countryName);

    const highlight = selectedCountry?.toLowerCase() || "";

    const mapData = useMemo(() => {
        return worldMap.features.map((feature) => {
            const key = feature.properties["hc-key"];
            return {
                "hc-key": key,
                value: key === highlight ? 1 : 0,
                name: feature.properties.name,
            };
        });
    }, [highlight]);

    const options = {
        chart: {
            map: worldMap,
            backgroundColor: "#ffffff",
            height: height, // Use the height prop directly
            spacing: [10, 10, 10, 10]
        },
        title: { text: "" },
        credits: { enabled: false },
        legend: { enabled: false },
        mapNavigation: {
            enabled: true,
            buttonOptions: { 
                verticalAlign: "bottom",
                align: "left",
                y: -5
            }
        },
        colorAxis: {
            min: 0,
            max: 1,
            stops: [
                [0, "#233977"],
                [1, "#1aa79c"]
            ]
        },
        series: [
            {
                data: mapData,
                mapData: worldMap,
                joinBy: "hc-key",
                borderColor: "#fff",
                borderWidth: 0.6,
                nullColor: "#E0E0E0",
                states: {
                    hover: {
                        color: "#1aa79c",
                        borderColor: "#fff",
                        borderWidth: 0.5,
                    }
                },
                tooltip: {
                    pointFormat: "{point.name}"
                }
            }
        ]
    };

    return (
        <div className={classes} >
            <fieldset className="pt-8 pb-0 border px-3 border-gray-200 bg-white rounded-md h-full">
                <legend className="m-auto">
                    <GeneralButton
                        content={"Geographical Presence"}
                        className="bg-themeblue cursor-default text-sm text-white"
                    />
                </legend>

                <HighchartsReact
                    highcharts={Highcharts}
                    constructorType="mapChart"
                    options={options}
                />
                <hr />
                {countryName && (
                    <p className='text-gray-400 text-[14px] text-medium text-center my-3'>{countryName}</p>
                )}
            </fieldset>
        </div>
    );
}