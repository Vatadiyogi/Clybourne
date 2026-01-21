import React, {useEffect, useState} from "react"
import BusinessDetails from "./BusinessDetails"
import Customer from "./Customer"
import Financial from "./Financial"
import Projections from "./Projections"
import Documents from "./Documents";
import BalanceSheet from "./BalanceSheet";
import anime from 'animejs';
import { useParams, useNavigate  } from "react-router-dom"
import { apiURL } from "../../../config/Config"
import Swal from "sweetalert2";
import axios from "axios"
import Graph from "./Graphs";
import Loader from "../../../common/Loader";

const Preview = () => {
    const { id } = useParams(); // Extract the ID from the URL
    const [data, setData] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [ editAllowed, setEditAllowed ] = useState(false);
    const role = localStorage.getItem('role');
    const [isLoading, setIsLoading] = useState(false);
    const [isScreenLoading, setScreenLoading] = useState(true);

    const handleSave = async (event) => {
        event.preventDefault();

        const text = data.order.status === 'Help Requested' ? 'You will not be able to make any more changes once the order is submitted. Since you have requested for support to complete the input financial data, we will complete and validate the remaining information. Do you wish to continue and submit the order?' : 'Please ensure that all the data being submitted is correct. Once submitted you will not be able to make any more changes. Do you wish to continue and submit the order?';
    
        // Show confirmation alert before proceeding
        Swal.fire({
            title: 'Are you sure?',
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, submit Order!',
            cancelButtonText: 'Cancel!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setIsLoading(true);
                try {
                    const response = await axios.put(apiURL + '/order/submit-order', {
                        orderId: id,
                        role: role
                    }, {
                        headers: {
                            Authorization: `${token}`
                        }
                    });
                    if (response.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Order Submitted',
                            text: response.data.message,
                        }).then(() => {
                            localStorage.removeItem('orderId');
                            if(role && role !== 'admin'){
                                navigate('/orders'); // Navigate to /dashboard after success
                            }else{
                                localStorage.clear(); 
                                window.close();
                            }
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: response.message || 'Something went wrong',
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.message || 'Something went wrong',
                    });
                }finally {
                    setIsLoading(false);
                }
            } else {
                // If canceled, do nothing or handle the cancel event
                Swal.fire({
                    icon: 'info',
                    title: 'Cancelled',
                    text: 'Order submission cancelled!',
                });
            }
        });
    };
    

    const backButton = async () => {
        navigate({
            pathname: `/valuation-form/${id}`,
            search: `?step=3`,
        });
    }

    const backOrderButton = async () => {
        navigate({
            pathname: `/orders`,
        });
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(apiURL+`/order/preview/${id}`);
                const result = await response.json();
                setData(result);
                
                setEditAllowed(result.editAllowed);
            } catch (error) {
                console.error("Error fetching data:", error);
            }finally{
                setScreenLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

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
     <section className="position-relative pt-15px pb-15px">
        {isScreenLoading ? 
         <Loader /> :
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12 order-1 order-lg-2 md-mb-50px" data-anime='{ "el": "childs", "translateY": [50, 0], "opacity": [0,1], "duration": 1200, "delay": 0, "staggervalue": 150, "easing": "easeOutQuad" }'>
                        <div className="row align-items-center justify-content-center position-relative z-index-1">
                            <div className="col-md-11 sm-ps-0 sm-pe-0">
                                <div className="card mt-15px rounded-bottom-0 border-0 box-shadow">
                                    <div className="card-header fw-600 mb-0 align-items-center bg-white text-blue">Input Data Preview</div>
                                    <div className="card-body overflow-hidden p-30px pt-15px">
                                        
                                        {data && data.customer && <Customer data={data}/>}

                                        <div className="w-100 divider-style-03 divider-style-03-02 border-color-light-gray mb-30px mt-30px"></div>

                                        {data && data.order && data.order.business && 
                                            <div className="row">
                                                <BusinessDetails data={data}/> 
                                                <Financial data={data}/>
                                            </div>
                                        }
                                        {data && Object.keys(data.calculations || {}).length > 0 && (
                                            <Projections data={data} />
                                        )}
                                        {data &&
                                            <Graph data={data}/>
                                        }
                                        {data && 
                                        <div className="row mt-30px">
                                            {data && Object.keys(data.calculations || {}).length > 0 && (
                                                <BalanceSheet data={data}/>
                                            )}
                                            <Documents data={data}/>
                                        </div>
                                        }
                                        {editAllowed ?
                                            <form action="" method="post" className="row contact-form-style-04 myform mt-30px">
                                                <div className="col-sm-12 text-center">
                                                {data && 
                                                    (
                                                        (data.order.status === "Help Requested" && data.order.custody === "Customer" && role === 'user') ||
                                                        (data.order.status === "Help Requested" && data.order.custody === "Company" && role === 'admin') || 
                                                        (data.order.status === "Pending Submission" && data.order.custody === "Customer")
                                                        ||                                                     
                                                        (data.order.status === "Completed" && data.order.custody === "Customer")
                                                    ) ? (isLoading ? (
                                                            <span>
                                                                <span><i className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></i></span>
                                                                <span className="btn-double-text ms-3px" data-text="Submitting...">Submitting...</span>
                                                            </span>
                                                        ) : (
                                                        <>
                                                        <button onClick={backButton} type="button" className="border-radius-0px btn btn-round-edge bg-blue submit h-40px p-0 ps-15px pe-15px fs-12 m-0 text-white fs-12 fw-600 text-capitalize fin-btn">
                                                            <i className="feather icon-feather-arrow-left-circle m-0 fs-16 align-text-bottom"></i> Back
                                                        </button>
                                                        &nbsp;
                                                        <button onClick={handleSave} className="border-radius-0px btn btn-round-edge bg-blue submit h-40px p-0 ps-15px pe-15px fs-12 m-0 text-white fs-12 fw-600 text-capitalize fin-btn">
                                                            <span>
                                                            <span><i className="feather icon-feather-check-circle m-0 fs-16 align-text-bottom"></i></span>
                                                            <span className="btn-double-text">Submit Report Order</span> 
                                                            </span>
                                                        </button>
                                                        </>
                                                        )
                                                    ) : (
                                                        <button onClick={backOrderButton} type="button" className="border-radius-0px btn btn-round-edge bg-blue submit h-40px p-0 ps-15px pe-15px fs-12 m-0 text-white fs-12 fw-600 text-capitalize fin-btn">
                                                        <i className="feather icon-feather-arrow-left-circle m-0 fs-16 align-text-bottom"></i> Back
                                                        </button>
                                                    )
                                                    }
                                                </div>
                                            </form>
                                        :    
                                        <div className="col-sm-12 text-center">
                                            <button onClick={backOrderButton} type="button" className="border-radius-0px btn btn-round-edge bg-blue submit h-40px p-0 ps-15px pe-15px fs-12 m-0 text-white fs-12 fw-600 text-capitalize fin-btn">
                                                <i className="feather icon-feather-arrow-left-circle m-0 fs-16 align-text-bottom"></i> Back
                                            </button>
                                        </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        }
    </section>
    );
}

export default Preview;