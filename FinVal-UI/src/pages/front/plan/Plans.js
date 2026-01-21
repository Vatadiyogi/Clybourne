import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiURL } from "../../../config/Config";
import Loader from '../../../common/Loader'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';

const Plans = ({ elementRef2 }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeAPlans, setTypeAPlans] = useState([]);
  const [boPlans, setBoPlans] = useState([]);
  const [bopPlans, setBopPlans] = useState([]);
  const [bocontentArray, setBoContentArray] = useState([]);
  const [bopcontentArray, setBopContentArray] = useState([]);
  const [AcontentArray, setAContentArray] = useState([]);
 
  const [selectedAdvisorPlan, setSelectedAdvisorPlan] = useState(""); // State for selected advisor plan

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${apiURL}/plan`);
        if (response.data.status) {
          const fetchedPlans = response.data.data;
          setPlans(fetchedPlans);

          const BOPlans = fetchedPlans.others.filter(plan => plan.planType === "BO");
          const BOPPlans = fetchedPlans.others.filter(plan => plan.planType === "BOP");

          if (BOPPlans.length > 0 && BOPPlans[0]['description'] !== "") {
            const parsedArray = parseHtmlList(BOPPlans[0]['description']);
            setBopContentArray(parsedArray);
          }

          if (BOPlans.length > 0 && BOPlans[0]['description'] !== "") {
            const parsedArray = parseHtmlList(BOPlans[0]['description']);
            setBoContentArray(parsedArray);
          }

          if (fetchedPlans.typeA.length > 0 && fetchedPlans.typeA[0]['description'] !== "") {
            const parsedArray = parseHtmlList(fetchedPlans.typeA[0]['description']);
            setAContentArray(parsedArray);
          }

          setBoPlans(BOPlans);
          setBopPlans(BOPPlans);
          setTypeAPlans(fetchedPlans.typeA);

          if (fetchedPlans.typeA.length > 0) {
            setSelectedAdvisorPlan(fetchedPlans.typeA[0]._id);
          }
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };

    const parseHtmlList = (htmlString) => {
      return htmlString
        .replace("<ul>", "")
        .replace("</ul>", "")
        .split("</li><li>")
        .map(item => item.replace("<li>", "").replace("</li>", ""));
    };

    fetchPlans();
  }, []);

  // Function to handle Buy Now click event
  const handleBuyNow = (planId) => {
    const isLoggedIn = localStorage.getItem('token');
  
    // Remove existing selectedPlan if it exists
    if (localStorage.getItem('selectedPlan')) {
      localStorage.removeItem('selectedPlan');
    }

    localStorage.setItem("selectedPlan", planId);
  
    if (!isLoggedIn) {
      // Redirect to login
      navigate("/user-login");
    } else {
      // Proceed to checkout page with selected plan
      navigate("/checkout");
    }
  };

  // Handle selection of advisor plan
  const handleAdvisorPlanChange = (event) => {
    const selectedPlan = typeAPlans.find(plan => plan._id === event.target.value);
    setSelectedAdvisorPlan(selectedPlan._id);
  };

  return (
    <section className="bg-very-light-gray padding-60-60">
      {loading ? (
        <Loader /> // Ensure Loader component is working as expected
      ) : (
        plans ? (
          <div className="container">
            <div className="row justify-content-center pb-50px">
              <div className="col-lg-8 text-center margin-7px" ref={elementRef2}>
                <span className="fs-16 d-inline-block fw-500 text-uppercase gray-text ls-1px">Amazing price</span>
                <h2 className="alt-font fw-600 ls-minus-1px mb-0 text-base-color">
                  Select the plan that's right for <span style={{ color: "#4ea8f6" }}>you</span>
                </h2>
              </div>
            </div>
            <div className="row row-cols-1 row-cols-lg-3 align-items-center justify-content-center">
              {boPlans.length > 0 &&
                <div className="col-lg-4 col-md-8 pricing-table-style-01 md-mb-30px" style={{ height: "700px", overflow: "hidden" }}>
                  <div className="pricing-table bg-white box-shadow-double-large">
                    <div className="pricing-header text-center text-white mb-1 p-2" style={{ borderRadius: "10px 10px 0 0", backgroundColor: "#4ea8f6", height: "185px" }}>
                      <div className="alt-font fw-700 text-uppercase text-base-color mb-1 pt-2 fs-22">
                        {boPlans.length > 0 && boPlans[0] ? boPlans[0]['name'] : ""}
                      </div>
                      <h3 className="d-inline-block mb-0 fw-400 ls-minus-2px">
                        ${boPlans.length > 0 && boPlans[0] ? boPlans[0]['price'] : ""}
                      </h3>
                      <span style={{ fontSize: "16px", lineHeight: "28px" }}>
                        &nbsp;for {boPlans.length > 0 && boPlans[0] ? boPlans[0]['reports'] : ""} report <br />
                      </span>
                      <div className="fs-14 lh-28">
                        (Access: {boPlans.length > 0 && boPlans[0] ? boPlans[0]['accessDays'] : ""} days)
                      </div>
                      <div className="fs-14 lh-28 pt-1">
                        Receive Valuation Report In 1 To 2 Working Days
                      </div>
                    </div>
                    <div className="pricing-body pb-0 p-4" style={{ height: "455px" }}>
                      <ul className="list-style-01 ps-0 mb-0">
                        {bocontentArray.map((item, index) => (
                          <li key={index} className="border-color-transparent-dark-very-light ps-2 pt-2 pb-2 fs-16" style={{ display: "flex", alignItems: "flex-start" }}>
                            <i className="bi bi-check2-circle fs-22 fw-700" style={{ color: "rgb(20, 193, 20)", marginRight: "8px", marginTop: "-4px" }}></i>
                            <span className="text-start lh-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pricing-footer text-center pb-2 bg-white md-pb-0">
                      <button type="button" onClick={() => handleBuyNow(boPlans[0]['_id'])}  className="btn btn-box-shadow btn-small btn-round-edge" style={{ backgroundColor: "#4ea8f6", color: "white" }}>Buy Now</button>
                    </div>
                  </div>
                </div>
              }
              {bopPlans.length > 0 &&
                <div className="col-lg-4 col-md-8 pricing-table-style-01 md-mb-30px" style={{ height: "700px", overflow: "hidden" }}>
                  <div className="pricing-table border-radius-6px text-center bg-white box-shadow-double-large">
                    <div className="pricing-header p-2 mb-1 bg-sky-blue" style={{ borderRadius: "10px 10px 0 0", height: "185px" }}>
                      <div className="alt-font fw-700 text-uppercase mb-1 pt-2 fs-22 text-base-color">
                        {bopPlans.length > 0 && bopPlans[0] ? bopPlans[0]['name'] : ""}
                      </div>
                      <h3 className="d-inline-block text-white mb-0 fw-400 ls-minus-2px text-start">
                        ${bopPlans.length > 0 && bopPlans[0] ? bopPlans[0]['price'] : ""}
                      </h3>
                      <span className="text-white" style={{ fontSize: "16px", lineHeight: "28px" }}>
                      &nbsp;for {bopPlans.length > 0 && bopPlans[0] ? bopPlans[0]['report'] : ""} report <br />
                        <span>with full assistance</span>
                      </span>
                      <div className="fs-14 text-white lh-28">
                        with data input (Access: {bopPlans.length > 0 && bopPlans[0] ? bopPlans[0]['accessDays'] : ""} days)
                      </div>
                      <div className="fs-14 text-white lh-28">
                        Receive Valuation Report In 1 To 2 Working Days
                      </div>
                    </div>
                    <div className="pricing-body p-4" style={{ height: "455px" }}>
                      <ul className="list-style-01 ps-0 mb-0">
                        {bopcontentArray.map((item, index) => (
                          <li key={index} className="border-color-transparent-dark-very-light ps-2 pt-2 pb-2 fs-16" style={{ display: "flex", alignItems: "flex-start" }}>
                            <i className="bi bi-check2-circle fs-22 fw-700" style={{ color: "rgb(20, 193, 20)", marginRight: "8px", marginTop: "-4px" }}></i>
                            <span className="text-start lh-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pricing-footer text-center pb-2 md-pb-0" style={{ backgroundColor: "white" }}>
                    <button type="button" onClick={() => handleBuyNow(bopPlans[0]['_id'])}  className="btn btn-box-shadow btn-small btn-round-edge" style={{ backgroundColor: "#4ea8f6", color: "white" }}>Buy Now</button>
                    </div>
                  </div>
                </div>
              }
              {typeAPlans.length > 0 &&
                <div className="col-lg-4 col-md-8 pricing-table-style-01 md-mb-30px" style={{ height: "700px", overflow: "hidden" }}>
                  <div className="pricing-table box-shadow-double-large border-radius-6px">
                    <div className="pricing-header mb-1 p-2 text-center bg-base-color" style={{ borderRadius: "10px 10px 0 0", height: "185px" }}>
                      <div className="alt-font fw-700 text-golden-color text-uppercase text-center pt-2 mb-1 fs-22">Advisor</div>
                      <label htmlFor="plan-select" className="text-center fw-400 text-white fs-16">Select The Plan Options</label>
                      <select id="plan-select" onChange={handleAdvisorPlanChange} className="form-select p-1" style={{ borderColor: "#b7b7b7", borderRadius: "6px", fontSize: "15px" }}>
                        {typeAPlans.map(plan => (
                          <option key={plan._id} value={plan._id}>
                            Reports: {plan.reports} Access Days: {plan.accessDays} Price: ${plan.price}
                          </option>
                        ))}
                      </select>
                      <div className="fs-14 mt-4 text-white lh-28">
                        Receive Valuation Report In 1 To 2 Working Days
                      </div>
                    </div>
                    <div className="pricing-body bg-white p-4" style={{ height: "455px" }}>
                      <ul className="list-style-01 ps-0 mb-0">
                        {AcontentArray.map((item, index) => (
                          <li key={index} className="border-color-transparent-dark-very-light ps-2 pt-2 pb-2 fs-16" style={{ display: "flex", alignItems: "flex-start" }}>
                            <i className="bi bi-check2-circle fs-22 fw-700" style={{ color: "rgb(20, 193, 20)", marginRight: "8px", marginTop: "-4px" }}></i>
                            <span className="text-start lh-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pricing-footer text-center pb-2 bg-white md-pb-0">
                      <button 
                        onClick={() => handleBuyNow(selectedAdvisorPlan)} 
                        className="btn btn-box-shadow btn-small btn-round-edge" 
                        style={{ backgroundColor: "#4ea8f6", color: "white" }}>
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
    ) : (
        <>No Plan Yet</>
    ))
    }
  </section>
);
};

export default Plans;
