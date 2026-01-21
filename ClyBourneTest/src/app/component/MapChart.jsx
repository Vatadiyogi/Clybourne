"use client";

import { useState, useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HC_map from "highcharts/modules/map.js";

// ✅ Initialize Highcharts Maps module safely
if (typeof HC_map === "function") {
  HC_map(Highcharts);
} else if (HC_map && typeof HC_map.default === "function") {
  HC_map.default(Highcharts);
}

// ✅ Import world map data (GeoJSON)
import worldMap from "@highcharts/map-collection/custom/world.geo.json";

export default function WorldHighlightMap() {
  const [highlightCountry, setHighlightCountry] = useState("in"); // default: India (ISO code lowercase)

  // ✅ Prepare map data — mark the selected country
  const mapData = useMemo(() => {
    return worldMap.features.map((feature) => {
      const key = feature.properties["hc-key"]; // Each country’s unique key (e.g., 'in', 'us')
      return {
        "hc-key": key,
        value: key === highlightCountry ? 1 : 0, // 1 = highlighted, 0 = normal
        name: feature.properties.name,
      };
    });
  }, [highlightCountry]);

  // ✅ Chart configuration
  const options = {
    chart: {
      map: worldMap,
      backgroundColor: "#ffffff", // White background for clear visibility
    },
    title: { text: "World Map Highlight" },
    credits: { enabled: false },
    legend: { enabled: false },
    mapNavigation: {
      enabled: true, // Enable zoom in/out (+ / -)
      buttonOptions: { verticalAlign: "bottom" },
    },

    // ✅ Color legend (used to color the map)
    colorAxis: {
      min: 0,
      max: 1,
      stops: [
        [0, "#233977"], //  themeblue
        [1, "#1aa79c"], //  themegreen
      ],
    },

    // ✅ Series = actual map layer
    series: [
      {
        data: mapData, // country data with values
        mapData: worldMap, // geojson map source
        joinBy: "hc-key", // link map data to country keys
        borderColor: "#fff", // dark border around countries
        borderWidth: 0.5,
        nullColor: "#E0E0E0", // default fill if no value assigned
        name: "Countries",
        states: {
          hover: {
            color: "#1aa79c", // 💠 Lighter blue when hovered
             borderColor: "#fff",
               borderWidth: 0.5,
          },
        },
        tooltip: {
          pointFormat: "{point.name}", // show country name on hover
        },
      },
    ],
  };

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      {/* 🌎 Dropdown for selecting a country */}
      <div style={{ marginBottom: 20 }}>
        <select
          value={highlightCountry}
          onChange={(e) => setHighlightCountry(e.target.value.toLowerCase())}
          style={{
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
            color: "black",
          }}
        >
          <option value="in">India 🇮🇳</option>
          <option value="us">United States 🇺🇸</option>
          <option value="fr">France 🇫🇷</option>
          <option value="gb">United Kingdom 🇬🇧</option>
          <option value="jp">Japan 🇯🇵</option>
          <option value="cn">China 🇨🇳</option>
          <option value="br">Brazil 🇧🇷</option>
          <option value="au">Australia 🇦🇺</option>
        </select>
      </div>

      {/* 🗺️ Map display */}
      <div style={{ width: "100%", height: "500px" }}>
        <HighchartsReact
          highcharts={Highcharts}
          constructorType="mapChart"
          options={options}
        />
      </div>
    </div>
  );
}
