import { getMonthName } from "../../../common/utils/dateUtils";
import { Link } from "react-router-dom";

const ParameterFormFields = ({calculations, businessDetails, formValues, errors, handleInputChange, save}) => {
    let interestExpense = parseFloat(calculations.finance.interestExpense);
    let debtLoan = parseFloat(calculations.finance.debtLoan);
    
    let result = (debtLoan === 0) ? 0.00 : ((interestExpense / debtLoan) * 100).toFixed(2);
console.log("formValues",formValues)
   return (

<div className="row justify-content-center">
    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-8">
        <div className="card">
            <div className="card-body">
            <style>
                            {`
                            td {
                                padding: 5px!important;
                            }
                            .first-td{
                            color:black;
                            font-weight:bold!important;
                            }
                            `}
                        </style>
                <table className="table" style={{ width: '50%', }}>
                    <tbody>
                        <tr>
                            <td className="first-td">Interest Rate (%)  :</td>
                            <td>{result}</td>
                        </tr>
                        <tr>
                            <td className="first-td">Financial Year End :</td>
                            <td>{businessDetails.FinYrEndMonth ? `${businessDetails.FinYrEndDate} ${businessDetails.FinYrEndMonth} ${businessDetails.FinYrEnd}` : ''}
                            </td>
                        </tr>
                        <tr>
                            <td className="first-td">Turnover:</td>
                            <td>{businessDetails.currency} {calculations.finance.sales.toFixed(2) || 0} ({calculations.finance.unitOfNumber})</td>
                        </tr>
                        <tr>
                            <td className="first-td">Currency Conversion Rate <br />  from USD to 
                                <input type="text" className="usd-input-box" value={businessDetails.currency} readOnly /> : 
                                
                            </td>
                            <td>
                            <input type="number" className="form-control form-control-input-parmeterForm "  style={{ marginTop: '15px', }} name="currencyConversionRate" value={formValues.currencyConversionRate} onChange={handleInputChange} />
                            {errors.currencyConversionRate && <div className="invalid-feedback">{errors.currencyConversionRate}</div>}
                            </td>
                            <td className="first-td">Turnover Factor (%) :</td>
                            <td>
                            <input type="text" className="form-control usd-input-box" name="cmpnyDiscFactorTurnover" value={formValues.cmpnyDiscFactorTurnover} onChange={handleInputChange} readOnly />
                            </td>
                        </tr>
                        <tr>
                        <td className="first-td">Year in Business:</td>
                        <td>{businessDetails.companyAge}</td>
                            <td className="first-td">Year-in-Business Factor (%) :</td>
                            <td>
                            <input type="text" className="form-control usd-input-box" name="cmpnyDiscFactorAge" value={formValues.cmpnyDiscFactorAge} readOnly />
                            </td>
                        </tr>
                        
                       
                        <tr>
                            <td className="first-td">Historical Earning Trend :</td>
                            <td>{businessDetails.earningTrend}</td>
                            <td className="first-td">Profitability Factor (%) :</td>
                            <td>
                            <input type="text" className="form-control usd-input-box" name="cmpnyDiscFactorProfiability" value={formValues.cmpnyDiscFactorProfiability} readOnly />
                            </td>
                        </tr>
                        <tr>
                            <td className="first-td">Company Discount Factor (%) :</td>
                            <td>
                                <input type="text" className="form-control form-control-in-parmeterForm " name="cmpnyDiscFactor" value={formValues.cmpnyDiscFactor} readOnly />
                            </td>
                        </tr>
                        <tr>
                            <td className="first-td">Alpha (%) :</td>
                            <td>
                                <input type="text" className="form-control form-control-in-parmeterForm " name="alpha" value={formValues.alpha || ''} readOnly />
                            </td>
                        </tr>
                        <tr>
                            <td className="first-td">Weighted of Adjusted Beta (%) :</td>
                            <td>
                                <input type="number" className="form-control form-control-input-parmeterForm " name="weightOfAdjBeta" value={formValues.weightOfAdjBeta} onChange={handleInputChange} />
                                {errors.weightOfAdjBeta && <div className="invalid-feedback">{errors.weightOfAdjBeta}</div>}
                            </td>
                        </tr>
                        <tr>
                            <td className="first-td">US 10 year Treasury Bond Rate (%) :</td>
                            <td>
                                <input type="number" className="form-control form-control-input-parmeterForm " name="treasuryondRate" value={formValues.treasuryondRate} onChange={handleInputChange} />
                                {errors.treasuryondRate && <div className="invalid-feedback">{errors.treasuryondRate}</div>}
                            </td>
                        </tr>
                        <tr>
                            <td className="first-td">Equity Risk Premium (%) :</td>
                            <td>
                                <input type="number" className="form-control form-control-input-parmeterForm " name="equityRiskPremium" value={formValues.equityRiskPremium} onChange={handleInputChange} />
                                {errors.equityRiskPremium && <div className="invalid-feedback">{errors.equityRiskPremium}</div>}
                            </td>
                        </tr>
                        <tr>
                            <td className="first-td">Country Risk Premium (%) :</td>
                            <td>
                                <input type="number" className="form-control form-control-input-parmeterForm " name="cntryRiskPremium" value={formValues.cntryRiskPremium} onChange={handleInputChange} />
                                {errors.cntryRiskPremium && <div className="invalid-feedback">{errors.cntryRiskPremium}</div>}
                            </td>
                        </tr>
                        <tr>
                            <td className="first-td">Corporate Tax Rate (%) :</td>
                            <td>
                                <input type="number" className="form-control form-control-input-parmeterForm" name="corpTaxRate" value={formValues.corpTaxRate} onChange={handleInputChange} />
                                {errors.corpTaxRate && <div className="invalid-feedback">{errors.corpTaxRate}</div>}
                            </td>
                        </tr>
                        <tr>
                            <td className="first-td">Perpetual Growth Rate (%) :</td>
                            <td>
                                <input type="number" className="form-control form-control-input-parmeterForm" name="perpetualGrowthRate" value={formValues.perpetualGrowthRate} onChange={handleInputChange} />
                                {errors.perpetualGrowthRate && <div className="invalid-feedback">{errors.perpetualGrowthRate}</div>}
                            </td>
                        </tr>
                        <tr>
                            <td className="first-td">DCF Weightage (%) :</td>
                            <td>
                                <input type="number" className="form-control form-control-input-parmeterForm" name="dcfWeightPercentage" value={formValues.dcfWeightPercentage} onChange={handleInputChange} />
                                {errors.dcfWeightPercentage && <div className="invalid-feedback">{errors.dcfWeightPercentage}</div>}
                            </td>
                        </tr>
                        <tr>
                            <td className="first-td">WACC Delta (%) :</td>
                            <td>
                                <input type="number" className="form-control form-control-input-parmeterForm" name="waccDelta" value={formValues.waccDelta} onChange={handleInputChange} />
                                {errors.waccDelta && <div className="invalid-feedback">{errors.waccDelta}</div>}
                            </td>
                        </tr>
                        <tr>
                            <td className="first-td">Perpetual Growth Delta (%) :</td>
                            <td>
                                <input type="number" className="form-control form-control-input-parmeterForm form-control form-control-in-parmeterForm-in-parmeterForm " name="pptlDelta" value={formValues.pptlDelta} onChange={handleInputChange} />
                                {errors.pptlDelta && <div className="invalid-feedback">{errors.pptlDelta}</div>}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className="container pt-4 pb-4">
                    <div className="row">
                        <div className="col text-center">
                            <div className="buttons d-flex justify-content-center">
                                <Link to="/orders" className="btn btn-sm btn-danger me-2">Cancel</Link>
                                {save && <button type="submit" className="btn btn-sm btn-primary me-2">Save/Next</button>}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>

   )
}

export default ParameterFormFields