import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Company from "./form/Company";
import anime from 'animejs';
import FinancialInfo from './form/FinancialInfo';
import ForecastInfo from './form/ForecastInfo';
import BalanceSheet from './form/BalanceSheet';
import './ValuationForm.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import { apiURL } from '../../config/Config';
import GraphElements from './Graph/GraphElements';

const ValuationForm = () => {
    const { orderId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({}); // to store form data
    const [isLoading, setIsLoading] = useState(false); // loading state
    const [companyData, setCompanyData] = useState({
        companyName: '',
        industryType: '',
        companyAge: '',
        companyType: '',
        country: '',
        currency : 'USD',
      });
    const [editAllowed, setEdit] = useState(true);
    const [finData, setFinData] = useState([]);  
    const [forecastData, setForecastData] = useState([]); 
    const [activeTab, setActiveTab] = useState("step"); // Default tab is 'step'

    const renderTabContent = () => {
        if (activeTab === "step") {
            return <div className="bg-light-blue ps-15px pe-15px">{renderStep()}</div>;
        } else if (activeTab === "graph") {
            return <GraphElements data={companyData} finData={finData} forecastData={forecastData} />;
        }
    }; 

    const queryParams = new URLSearchParams(location.search);
    const step = parseInt(queryParams.get('step'), 10) || 0;
    
    const fetchOrderData = async (orderId) => {
        if (orderId) {
            setIsLoading(true); // set loading to true
            try {
                const response = await axios.get(`${apiURL}/order/preview/${orderId}`);
                if (response.status === 200) {
                    setFormData(response.data);
                    setCurrentStep(step);
                    setOrderData(response.data);
                }
            } catch (error) {
                console.error('Error fetching company data:', error);
            } finally {
                setIsLoading(false); // set loading to false when done
            }
        }
    };

    useEffect(() => {
        fetchOrderData(orderId);
    }, [orderId]); 

    const handleSaveAndFetch = async (nextStep) => {
        await fetchOrderData(orderId); // Re-fetch the data
        setCurrentStep(nextStep); // Move to the next step
         // Update the query parameter 'step' in the URL
         const searchParams = new URLSearchParams(location.search);
         searchParams.set('step', nextStep);
         navigate({
            pathname: location.pathname,
            search: `?step=${nextStep}`,
        });
    };

    const handleFieldBlur = (fieldName, value) => {
        setCompanyData(prevData => ({
        ...prevData,
        [fieldName]: value
        }));
    };

    const handleSaleChange = (data) => {
        setFinData(prevData => ({
            ...prevData,
            ...data
        }));
    };

    const handleForecastData = (data) => {
        setForecastData(prevData => ({
            ...prevData,
            ...data
        }));
    };

    const setOrderData = async (data) => {
        if (data?.order?.business?.business) {
            const newData = {
                companyName: data.order.business.business.companyName,
                industryType: data.order.business.business.industryType,
                companyAge: data.order.business.business.companyAge,
                companyType: data.order.business.business.companyType,
                country: data.order.business.business.country,
                currency: data.order.business.business.currency,
            };
            setCompanyData(newData);
        }
        if (data?.graphData?.finData) {
            setFinData(data.graphData.finData);
        }
        if (data?.graphData?.forecastData) {
            setForecastData(data.graphData.forecastData);
        }
        if(data){
            setEdit(data.editAllowed);
        }
    };
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

    // Update state based on window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 992);
        };

        // Attach the event listener
        window.addEventListener('resize', handleResize);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const renderStep = () => {
        if (isLoading) {
            return <div>Loading...</div>; // Display loading indicator
        }
      
        switch (currentStep) {
            case 0:
                return <Company onSave={() => handleSaveAndFetch(1)} initialData={formData} onFieldBlur={handleFieldBlur} orderId={orderId} editAllowed={editAllowed}/>;
            case 1:
                return <FinancialInfo onSave={() => handleSaveAndFetch(2)} initialData={formData} backButton={() =>handleSaveAndFetch(0)} onFieldChange={handleSaleChange} orderId={orderId} editAllowed={editAllowed}/>;
            case 2:
                return <ForecastInfo onSave={() => handleSaveAndFetch(3)} initialData={formData} backButton={() => handleSaveAndFetch(1)} onPercentChange={handleForecastData} orderId={orderId} editAllowed={editAllowed}/>;
            case 3:
                return <BalanceSheet onSave={() => handleSaveAndFetch(0)} initialData={formData} backButton={() => handleSaveAndFetch(2)} orderId={orderId} editAllowed={editAllowed}/>;
            default:
                return <Company onSave={() => handleSaveAndFetch(1)} initialData={formData} onFieldBlur={handleFieldBlur} orderId={orderId} editAllowed={editAllowed}/>;
        }
      };

    useEffect(() => {
    const elements = document.querySelectorAll('[data-anime]');
    elements.forEach(el => {
        const animeConfig = JSON.parse(el.getAttribute('data-anime'));
        anime({
        targets: el,
        ...animeConfig,
        });
    });
    }, []);

   return (
     <>
        <section className="position-relative p-0">
    <div className="container-fluid">
        <div className="row">
            <div className="col-lg-12 order-1 order-lg-2 md-mb-50px" data-anime='{ "el": "childs", "translateY": [50, 0], "opacity": [0,1], "duration": 1200, "delay": 0, "staggervalue": 150, "easing": "easeOutQuad" }'>

                {/* Mobile Tabs */}
                <div className="d-block d-lg-none">
                    <button
                        className={`tab-button tab-btn-new ${activeTab === "step" ? "active" : ""}`}
                        onClick={() => setActiveTab("step")}
                    >
                        Modify values
                    </button>
                    <button
                        className={`tab-button tab-btn-new ${activeTab === "graph" ? "active" : ""}`}
                        onClick={() => setActiveTab("graph")}
                    >
                        Preview
                    </button>
                </div>

                {isMobile ? (
                <div className="d-block d-lg-none mt-3">
                    <div style={{ display: activeTab === "step" ? "block" : "none" }}>
                        {renderStep()}
                    </div>
                    <div style={{ display: activeTab === "graph" ? "block" : "none" }}>
                        <GraphElements data={companyData} finData={finData} forecastData={forecastData} />
                    </div>
                </div>
            ) : (
                // Desktop View: Show both components side-by-side
                <div className="row d-none d-lg-flex">
                    <div className="col-12 col-lg-5 bg-light-blue ps-15px pe-15px">
                        {renderStep()}
                    </div>
                    <div className="col-12 col-lg-7">
                        <GraphElements data={companyData} finData={finData} forecastData={forecastData} />
                    </div>
                </div>
            )}
                
            </div>
        </div>
    </div>
</section>

        <div className="scroll-progress d-none d-xxl-block">
            <a href="#" className="scroll-top" aria-label="scroll">
                <span className="scroll-text">Scroll</span><span className="scroll-line"><span className="scroll-point"></span></span>
            </a>
        </div>
     </>
   );
}

export default ValuationForm;
