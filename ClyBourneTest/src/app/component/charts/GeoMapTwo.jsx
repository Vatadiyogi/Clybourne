"use client";
import { useMemo, useEffect, useRef } from "react";
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

export default function GeoMap({ selectedCountry, classes = "w-full", height }) {
    console.log("Selected country code:", selectedCountry);

    const chartRef = useRef(null);

    // Get country name from code
    const countryName = getCountryName(selectedCountry);
    console.log("Country name:", countryName);

    const highlight = selectedCountry?.toLowerCase() || "";

    // Zoom to selected country
    useEffect(() => {
        if (chartRef.current && selectedCountry) {
            const chart = chartRef.current.chart;

            // Find the country feature to zoom to
            const countryFeature = worldMap.features.find(
                feature => feature.properties["hc-key"] === highlight
            );

            if (countryFeature) {
                // Get the bounding box of the country
                const bbox = countryFeature.bbox || getBBoxFromCoordinates(countryFeature);

                if (bbox) {
                    // Zoom to the country with animation
                    chart.mapZoom(0.5, bbox[0], bbox[1], bbox[2], bbox[3]);
                }
            }
        }
    }, [selectedCountry, highlight]);

    // Helper function to calculate bbox if not available
    const getBBoxFromCoordinates = (feature) => {
        if (feature.geometry && feature.geometry.coordinates) {
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

            const processCoordinates = (coords) => {
                if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
                    minX = Math.min(minX, coords[0]);
                    minY = Math.min(minY, coords[1]);
                    maxX = Math.max(maxX, coords[0]);
                    maxY = Math.max(maxY, coords[1]);
                } else {
                    coords.forEach(processCoordinates);
                }
            };

            processCoordinates(feature.geometry.coordinates);

            return [minX, minY, maxX, maxY];
        }
        return null;
    };

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

    // Custom zoom button component
    const ZoomControls = () => (
        <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '5px'
        }}>
            <button
                onClick={() => {
                    if (chartRef.current) {
                        chartRef.current.chart.mapZoom();
                    }
                }}
                style={{
                    width: '30px',
                    height: '30px',
                    background: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
            >
                +
            </button>
            <button
                onClick={() => {
                    if (chartRef.current) {
                        chartRef.current.chart.mapZoom();
                    }
                }}
                style={{
                    width: '30px',
                    height: '30px',
                    background: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
            >
                −
            </button>
            <button
                onClick={() => {
                    if (chartRef.current) {
                        // Reset zoom to full world view
                        chartRef.current.chart.mapZoom();
                    }
                }}
                style={{
                    width: '30px',
                    height: '30px',
                    background: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    marginTop: '5px'
                }}
            >
                ↺
            </button>
        </div>
    );

    const options = {
        chart: {
            map: worldMap,
            backgroundColor: "#ffffff",
            height: height,
            spacing: [10, 10, 10, 10],
            events: {
                load: function () {
                    // Initial zoom to selected country if exists
                    if (selectedCountry) {
                        setTimeout(() => {
                            const countryFeature = worldMap.features.find(
                                feature => feature.properties["hc-key"] === highlight
                            );

                            if (countryFeature) {
                                const bbox = countryFeature.bbox || getBBoxFromCoordinates(countryFeature);
                                if (bbox) {
                                    this.mapZoom(0.5, bbox[0], bbox[1], bbox[2], bbox[3]);
                                }
                            }
                        }, 100);
                    }
                }
            }
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
                },
                point: {
                    events: {
                        click: function () {
                            // Optional: Zoom to country when clicked
                            const point = this;
                            const bbox = worldMap.features.find(
                                f => f.properties["hc-key"] === point["hc-key"]
                            )?.bbox;

                            if (bbox) {
                                point.series.chart.mapZoom(0.5, bbox[0], bbox[1], bbox[2], bbox[3]);
                            }
                        }
                    }
                }
            }
        ]
    };

    return (
        <div className={classes} style={{ position: 'relative' }}>
            {/* <ZoomControls /> */}
            <HighchartsReact
                highcharts={Highcharts}
                constructorType="mapChart"
                options={options}
                ref={chartRef}
            />
        </div>
    );
}