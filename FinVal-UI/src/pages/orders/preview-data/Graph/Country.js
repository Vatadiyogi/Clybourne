import React, { useEffect } from 'react';
import Highcharts from 'highcharts/highmaps';
import { countries } from '../../../../common/Country';

const Country = ({ data }) => {
    // Define the countries array with name, code, latitude, and longitude
    const countriesList = countries();

    // Function to update the map based on the selected country name
    const updateMap = (countryName) => {
        const selectedCountry = countriesList.find(country => country.name === countryName);
        if (!selectedCountry) return;

        const { code: countryCode, lat, lon } = selectedCountry;

        (async () => {
            const topology = await fetch(
                'https://code.highcharts.com/mapdata/custom/world.topo.json'
            ).then(response => response.json());

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
                    center: [lon, lat], // Use selected country's coordinates
                    zoom: 2.8 // Adjust the zoom level to focus on the country
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
        // Update the map with the selected country from data.company
        if (data && data.country) {
            updateMap(data.country);
        }
    }, [data]);

    return (
    <>        
        {data.country && 
        <div className="col-sm-4">
            <div className="card mt-30px mb-15px rounded-bottom-0 border-0 box-shadow">
                <div className="card-header fw-700 fs-14 ps-10px pt-5px pb-0 mb-0 lh-normal border-0 bg-white text-blue">Geographical Presence ({data.country})</div>
                <div className="card-body p-0 overflow-hidden">
                    <div id="finCountry"></div>
                </div>
            </div>
        </div>
        }    
    </>
    );
};

export default Country;
