import DonutChart from "../../components/Chart/DonutChart";
import RevenueChart from "../../components/Chart/RevenueChart";
import SalesChart from "../../components/Chart/SalesChart";
import './Dashboard.css';
const Widgets = () => {
    const data = [
        { label: 'A', value: 85 },
        { label: 'BOP', value: 45 },
        { label: 'BO', value: 65 },
    ];

    return (
        <>
        <div className="dashboard-heading"> 
        </div>
            <div className="row">
                <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12 layout-spacing">
                    <div className="widget widget-table-one">
                        <div className="widget-heading">
                            <h5 className="">Report Orders for Action</h5>
                        </div>

                        <div className="widget-content">
                            <div className="transactions-list">
                                <div className="t-item">
                                    <div className="t-company-name">
                                        <div className="t-name">
                                            <h4>Help Requested</h4>
                                        </div>
                                    </div>
                                    <div className="t-rate rate-dec">
                                        <p><span>3</span></p>
                                    </div>
                                </div>
                            </div>

                            <div className="transactions-list t-info">
                                <div className="t-item">
                                    <div className="t-company-name">
                                        <div className="t-name">
                                            <h4>Submitted</h4>
                                        </div>
                                    </div>
                                    <div className="t-rate rate-inc">
                                        <p><span>2</span></p>
                                    </div>
                                </div>
                            </div>

                            <div className="transactions-list">
                                <div className="t-item">
                                    <div className="t-company-name">
                                        <div className="t-name">
                                            <h4>Resubmitted</h4>
                                        </div>

                                    </div>
                                    <div className="t-rate rate-inc">
                                        <p><span>4</span></p>
                                    </div>
                                </div>
                            </div>                        
                            
                        </div>
                    </div>
                </div>

                <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12 layout-spacing">
                    <div className="widget widget-table-one">
                        <div className="widget-heading">
                            <h5 className="">All Report Orders</h5>
                        </div>

                        <div className="widget-content">
                            <div className="transactions-list">
                                <div className="t-item">
                                    <div className="t-company-name">
                                        <div className="t-name">
                                            <h4>Total</h4>
                                        </div>
                                    </div>
                                    <div className="t-rate rate-dec">
                                        <p><span>5401</span></p>
                                    </div>
                                </div>
                            </div>

                            <div className="transactions-list t-info">
                                <div className="t-item">
                                    <div className="t-company-name">
                                        <div className="t-name">
                                            <h4>Pending Submission</h4>
                                        </div>
                                    </div>
                                    <div className="t-rate rate-inc">
                                        <p><span>4000</span></p>
                                    </div>
                                </div>
                            </div>

                            <div className="transactions-list">
                                <div className="t-item">
                                    <div className="t-company-name">
                                        <div className="t-name">
                                            <h4>Completed</h4>
                                        </div>

                                    </div>
                                    <div className="t-rate rate-inc">
                                        <p><span>1077</span></p>
                                    </div>
                                </div>
                            </div>                        
                            
                        </div>
                    </div>
                </div>

                <div className="col-xl-4 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing">
                    <div className="widget widget-chart-two">
                        <div className="widget-heading">
                            <h5 className="">Report Order by Type</h5>
                        </div>
                        <div className="widget-content">
                            <DonutChart data={data} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12 layout-spacing"style={{ marginTop: '-70px' }}>
                    <div className="widget-one widget">
                        <div className="widget-content">
                            <div className="w-numeric-value">
                                <div className="w-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" strokeLinejoin="round" className="feather feather-shopping-cart"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                                </div>
                                <div className="w-content">
                                    <span className="w-value">85</span>
                                    <span className="w-numeric-title">Total Orders</span>
                                </div>
                            </div>
                            <div className="w-chart">
                                <SalesChart />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12 layout-spacing" style={{ marginTop: '-70px' }}>
                    <div className="widget-one widget">
                        <div className="widget-content">
                            <div className="w-numeric-value">
                                <div className="w-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" strokeLinejoin="round" className="feather feather-message-circle"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                                </div>
                                <div className="w-content">
                                    <span className="w-value">$35,502</span>
                                    <span className="w-numeric-title">Revenue last 30 days</span>
                                </div>
                            </div>
                            <div className="w-chart">
                                <RevenueChart />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12 layout-spacing">
                <div className="widget widget-three">
                    <div className="widget-heading">
                        <h5 className="">Revenue by Plan Type</h5>

                        <div className="task-action">
                            <div className="dropdown">
                                
                            </div>
                        </div>

                    </div>
                    <div className="widget-content">

                        <div className="order-summary">

                            <div className="summary-list">
                                <div className="w-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" strokeLinejoin="round" className="feather feather-shopping-bag"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                                </div>
                                <div className="w-summary-details">
                                    
                                    <div className="w-summary-info">
                                        <h6>Advisor</h6>
                                        <p className="summary-count">$92,600</p>
                                    </div>

                                    <div className="w-summary-stats">
                                        <div className="progress">
                                            <div className="progress-bar bg-gradient-secondary" role="progressbar" style={{ width: '90%' }} aria-valuenow="90" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </div>

                                </div>

                            </div>

                            <div className="summary-list">
                                <div className="w-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" strokeLinejoin="round" className="feather feather-tag"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7" y2="7"></line></svg>
                                </div>
                                <div className="w-summary-details">
                                    
                                    <div className="w-summary-info">
                                        <h6>Business Owner</h6>
                                        <p className="summary-count">$37,515</p>
                                    </div>

                                    <div className="w-summary-stats">
                                        <div className="progress">
                                            <div className="progress-bar bg-gradient-success" role="progressbar" style={{ width: '65%' }} aria-valuenow="65" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </div>

                                </div>

                            </div>

                            <div className="summary-list">
                                <div className="w-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" strokeLinejoin="round" className="feather feather-credit-card"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                                </div>
                                <div className="w-summary-details">
                                    
                                    <div className="w-summary-info">
                                        <h6>Business Owner Plus</h6>
                                        <p className="summary-count">$55,085</p>
                                    </div>

                                    <div className="w-summary-stats">
                                        <div className="progress">
                                            <div className="progress-bar bg-gradient-warning" role="progressbar" style={{ width: '80%' }} aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                            
                        </div>
                        
                    </div>
                </div>
                </div>
            </div>

        </>
    )

}

export default Widgets;