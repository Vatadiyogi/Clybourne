import { Link } from "react-router-dom";

const NeedHelp = ({data}) => {
  return (
    <div className="header-cart-icon icon float-end">
        <div className="header-cart dropdown">
            <a href="javascript:void(0);" className="float-end text-blue text-golden-hover fw-600 fs-12"><i className="bi bi-info-circle-fill"></i> Need Help?</a> 
            <ul className="cart-item-list p-15px bg-light-blue">
                <li className="cart-item align-items-center fs-12 pt-0">
                    We can help you in completing the input data required to order the valuation report.
                </li>
                <li className="cart-item align-items-center fs-12 d-inline-block">
                    Upgrade to <span className="fw-900">Business Owner Plus</span> plan where our analyst will review your companys data and work with you to fill the required information.
                </li>
                <li className="cart-item align-items-center justify-content-center pb-0">
                    <Link to="/upgrade-plan" className="bg-blue h-40px lh-40 p-0 ps-15px pe-15px fs-12 m-0 text-white fs-12 fw-600 text-capitalize fin-btn d-inline-block ls-05px border-radius-4px">
                        Upgrade Now for just ${data.price}
                    </Link>
                </li>
            </ul>
        </div>
    </div>
  );
}

export default NeedHelp;