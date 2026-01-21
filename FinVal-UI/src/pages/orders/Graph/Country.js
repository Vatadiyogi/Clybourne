import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts/highmaps';
import { countries } from '../../../common/Country';
import indiaMapImage from '../../../assets/finimg/new-india.png'; // Import the India map image

// Import FontAwesome Icons for zoom buttons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const Country = ({ data }) => {
    const countriesList = countries();
    const [isIndiaSelected, setIsIndiaSelected] = useState(false); // Track if India is selected
    const [zoomLevel, setZoomLevel] = useState(1);  // State to manage zoom level
    const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Track window width

    // Update window width on resize
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const updateMap = (countryName) => {
        const selectedCountry = countriesList.find(country => country.name === countryName);
        if (!selectedCountry) return;

        const { code: countryCode, lat, lon } = selectedCountry;

        (async () => {
            const topology = await fetch(
                'https://code.highcharts.com/mapdata/custom/world.topo.json'
            ).then(response => response.json());

            console.log(topology);

            Highcharts.mapChart('finCountry', {
                chart: {
                    map: topology
                },
                title: {
                    text: '',
                    align: 'left'
                },
                credits: {
                    enabled: false,
                },
                mapNavigation: {
                    enabled: true,
                    enableDoubleClickZoomTo: true,
                    enableMouseWheelZoom: true,
                    buttonOptions: {
                        verticalAlign: 'bottom'
                    }
                },
                mapView: {
                    projection: {
                        name: 'WebMercator'
                    },
                    center: [lon, lat],
                    zoom: 2.8
                },
                legend: {
                    enabled: false
                },
                colorAxis: {
                    min: 65,
                    minColor: 'black',
                    maxColor: '#050315'
                },
                series: [{
                    name: 'Selected Country',
                    data: [{ code: countryCode, value: 1 }],
                    joinBy: ['iso-a2', 'code'],
                    states: {
                        hover: {
                            color: 'black'
                        }
                    },
                    dataLabels: {
                        enabled: false,
                        format: '{point.name}'
                    },
                    borderColor: '#fff',
                    borderWidth: 0.1,
                }]
            });
        })();
    };

    useEffect(() => {
        if (data && data.country) {
            if (data.country === "India") {
                // Set state to indicate India is selected
                setIsIndiaSelected(true);

                // Destroy any existing Highcharts instance
                Highcharts.charts.forEach(chart => {
                    if (chart && chart.renderTo.id === 'finCountry') {
                        chart.destroy();
                    }
                });

                // Clear the container
                const container = document.getElementById('finCountry');
                if (container) {
                    container.innerHTML = '';
                }
            } else {
                // Reset state when India is not selected
                setIsIndiaSelected(false);

                // Render the Highcharts map
                updateMap(data.country);
            }
        }
    }, [data]);

    // Handle zoom-in and zoom-out actions
    const handleZoomIn = () => {
        setZoomLevel(prevZoom => Math.min(prevZoom + 0.5, 2)); // Max zoom level of 2
    };

    const handleZoomOut = () => {
        setZoomLevel(prevZoom => Math.max(prevZoom - 0.5, 1)); // Min zoom level of 1
    };

    return (
        <>
            {data.country &&
                <div className="col-sm-12">
                    <div className="card mt-15px mb-15px rounded-bottom-0 border-0 box-shadow">
                        <div className="card-header fw-700 fs-14 ps-10px pt-5px pb-0 mb-0 lh-normal border-0 bg-white text-blue">
                            Geographical Presence ({data.country})
                        </div>
                        <div className="card-body p-0 overflow-hidden" style={{ textAlign: "center", position: "relative" }}>
                            {isIndiaSelected ? (
                                <>
                                    {/* Zoom Buttons with FontAwesome Icons */}
                                    <div style={{
                                        position: "absolute",
                                        top: windowWidth <= 400 ? "36%" : "65%", // Adjust top based on screen width
                                        left: windowWidth <= 400 ? "5%" : "4%", // Adjust left position for small screens
                                        transform: "translateX(-50%)",
                                        display: "block", gap: "10px", zIndex: "100"
                                    }}>
                                        <button
                                            onClick={handleZoomIn}
                                            style={{
                                                padding: "5px", fontSize: "17px", fontWeight: "900", cursor: "pointer",
                                                color: "rgb(80 80 80)", border: "1px solid rgb(74 73 73 / 17%)",
                                                display: "flex", justifyContent: "center", alignItems: "center", background: "none"
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                        <button
                                            onClick={handleZoomOut}
                                            style={{
                                                padding: "5px", fontSize: "17px", fontWeight: "900", cursor: "pointer",
                                                color: "rgb(80 80 80)", border: "1px solid rgb(74 73 73 / 17%)",
                                                display: "flex", justifyContent: "center", alignItems: "center", background: "none"
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faMinus} />
                                        </button>
                                    </div>

                                    {/* India Map Image with Zoom */}
                                    <div style={{ textAlign: "center" }}>
                                        <img
                                            src={indiaMapImage}
                                            alt="India Map"
                                            style={{
                                                maxWidth: "100%",
                                                height: "auto",
                                                objectFit: "contain",
                                                transform: `scale(${zoomLevel})`, // Apply zoom level
                                                transition: "transform 0.6s ease", // Smooth transition
                                                maxHeight: "200px", // Max height to keep the image size manageable
                                            }}
                                        />
                                    </div>
                                </>
                            ) : (
                                // Render the Highcharts map container for other countries
                                <div id="finCountry" style={{ height: "200px" }}></div>
                            )}
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default Country;
