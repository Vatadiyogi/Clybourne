const Details = () => {
  return (
    <div className="col-sm-6 sm-pe-0 sm-ps-0">
        <p className="text-green d-none sm-d-block fs-13 mb-0 fw-600">Your plan offers help from our financial experts.</p>
        <fieldset className="ps-15px pe-15px pb-10px h-80 d-block">
        <legend className="fw-600 float-none border-1px col-auto fs-14 ps-15px pe-15px p-5px lh-1 border-radius-4px bg-light-blue text-blue m-0">How you can get support?</legend>
            <div className="p-15px sm-p-5px">
                <p className="d-flex fs-16 lh-normal"><i className="bi bi-bookmark-star-fill text-blue fs-20 me-5px"></i> Upload following financial documents as available and our financial expert will review and get in touch with you to complete the required input data</p>
                <div className="border border-color-extra-medium-gray border-radius-6px overflow-hidden mb-20px">
                    <p className="p-15px border-bottom border-1 mb-0 fs-14 border-color-extra-medium-gray">
                        <span className="d-flex align-items-center sm-align-items-normal"><i className="bi bi-diamond-half text-blue fs-14 me-5px"></i> Most recent company balance sheet</span>
                        <span className="d-flex align-items-center sm-align-items-normal"><i className="bi bi-diamond-half text-blue fs-14 me-5px"></i> Most recent company profit & loss statement</span>
                        <span className="d-flex align-items-center sm-align-items-normal"><i className="bi bi-diamond-half text-blue fs-14 me-5px"></i> Most recent company cash flow statement</span>
                    </p>
                    <p className="p-10px border-bottom border-1 mb-0 lh-normal fs-16 border-color-extra-medium-gray bg-very-light-golden"><span className="fw-700 text-blue">OR</span></p>
                    <p className="p-15px border-bottom border-1 border-color-extra-medium-gray mb-0 fs-14">
                        <span className="d-flex align-items-center sm-align-items-normal"><i className="bi bi-diamond-half text-blue fs-14 me-5px"></i> Last audited company financial statement</span>
                    </p>
                </div>
                <p className="d-flex fs-16 lh-normal"><i className="bi bi-bookmark-star-fill text-blue fs-20 me-5px"></i> Please continue to input whatever business and financial information you can, even after uploading the documents. Then submit the order.</p>
                <p className="d-flex fs-16 lh-normal mb-0"><i className="bi bi-bookmark-star-fill text-blue fs-20 me-5px"></i> <span>For any other query regarding the valuation process please write to us at <a href="mailto:valuationsupport@fin-advisor.com" className="text-golden">valuationsupport@fin-advisor.com</a></span></p>
            </div>
        </fieldset>
    </div>
  );
}

export default Details;