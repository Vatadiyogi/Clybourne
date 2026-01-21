const Heading = ({data}) => {
  const customer = data.customers || [];  
  return (
    <div className="row row-cols-1 row-cols-lg-4 row-cols-md-4 justify-content-center align-items-center pt-1" data-anime='{ "el": "childs", "rotateZ": [5, 0], "translateY": [50, 0], "opacity": [0,1], "duration": 600, "delay": 0, "staggervalue": 300, "easing": "easeOutQuad" }'>
        <div className="col w-20 icon-with-text-style-10 mt-15px fin-box width-responsive-100">
            <p className="fw-600 text-blue fs-19 m-0">My Orders</p>
            <div className="divider-style-03 divider-style-03-01 m-0 w-100" style={{borderColor:'rgba(0, 0, 0, 0.175)'}}></div>
        </div>
        <fieldset className="ps-15px w-75 pe-15px pb-10px h-100 d-block width-responsive-88" style={{background:'#f2f3f6'}}>
            <legend className="fw-600 float-none border-1px col-auto fs-14 ps-15px pe-15px p-5px lh-1 border-radius-4px bg-light-blue text-blue m-0">Current Active Plan</legend>
            <div className="row">
                <div className="col-lg-4  icon-with-text-style-10 mt-15px fin-box">
                    <div className="feature-box bg-white justify-content-center box-shadow p-5px border-radius-5px border-1 border-solid border-light-blue">
                        <div className="row row-cols-2 align-items-center justify-content-start w-100">
                            <div className="feature-box-icon feature-box-icon-rounded w-35px h-35px rounded-circle p-0">
                                <i className="line-icon-Bulleted-List text-blue text-dark-blue-hover fs-16 fw-600"></i>
                            </div>
                            <div className="col-sm-8 col-md-8 feature-box-content last-paragraph-no-margin lh-normal text-start ps-10px">
                                <p className="fs-12  lh-normal">Plan Type / Plan ID</p>
                                <span className="d-block fw-600 text-black mb-0 fs-16">{customer.activePlanType || ''} {customer.planId ? '/ ' + customer.planId  : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4  icon-with-text-style-10 mt-15px fin-box">
                    <div className="feature-box bg-white justify-content-center box-shadow p-5px  border-radius-5px border-1 border-solid border-light-blue">
                        <div className="row row-cols-2 align-items-center justify-content-start w-100">
                            <div className="feature-box-icon feature-box-icon-rounded w-35px h-35px rounded-circle">
                                <i className="line-icon-Box-Close text-blue text-dark-blue-hover fs-16 fw-600"></i>
                            </div>
                            <div className=" col-md-8 col-sm-8 feature-box-content last-paragraph-no-margin lh-normal text-start  sm-pe-0 ps-10px ">
                                <p className="fs-12  lh-normal">New Orders Available</p>
                                <span className="d-block fw-600 text-black mb-0 fs-16">{customer.TotalPlanOrderedCount || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 icon-with-text-style-10 mt-15px fin-box">
                    <div className="feature-box bg-white justify-content-center box-shadow p-5px border-radius-5px border-1 border-solid border-light-blue">
                        <div className="row row-cols-2 align-items-center justify-content-start w-100">
                            <div className="feature-box-icon feature-box-icon-rounded w-35px h-35px rounded-circle">
                                <i className="line-icon-Time-Backup text-blue text-dark-blue-hover fs-16 fw-600"></i>
                            </div>
                            <div className=" col-md-8 col-sm-8 feature-box-content last-paragraph-no-margin lh-normal text-start ps-10px">
                                <p className="fs-12  lh-normal text-nowrap">Days Remaining in plan</p>
                                <span className="d-block fw-600 text-black mb-0 fs-16">{customer.daysLeft+1 || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </fieldset>
    </div>
  )
}

export default Heading;