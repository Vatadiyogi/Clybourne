import React, { useState, useEffect, useCallback } from 'react';
import ParameterFormFields from './ParmeterFormFields';
import { formatNumber } from '../../../common/utils/numberUtils';
import './View.css';

const ParameterForm = ({ data, onFormSubmit }) => {
  const businessDetails = data.businessDetails.business;
  const { calculations } = data;
  const back_end_inputs = data.calculations.back_end_inputs || '';
  const [errors, setErrors] = useState({});
  const userId = localStorage.getItem('user_id');
  const isAssignedToCurrentUser = data.assignedId === userId;
  const save = ((data.status === "Submitted" || data.status === "Re-Submitted") && isAssignedToCurrentUser) ? true : false;

  const [formValues, setFormValues] = useState({
    currencyConversionRate: back_end_inputs.currencyConversionRate 
    ? back_end_inputs.currencyConversionRate 
    : (businessDetails.currency === 'USD' ? '1' : ''),
    cmpnyDiscFactorTurnover: formatNumber(back_end_inputs.cmpnyDiscFactorTurnover) || '',
    sales: formatNumber(back_end_inputs.sales) || '',
    cmpnyDiscFactorAge: formatNumber(data.businessDetails.companyAgeDiscountFactor) || '',
    cmpnyDiscFactorProfiability: formatNumber(data.businessDetails.earningTrendDiscountFactor) || '',
    alpha: formatNumber(data.businessDetails.companyAgeAlphaFactor) || '',
    cmpnyDiscFactor: formatNumber(back_end_inputs.cmpnyDiscFactor) || '',
    weightOfAdjBeta: formatNumber(back_end_inputs.weightOfAdjBeta) || '',
    treasuryondRate: formatNumber(back_end_inputs.treasuryondRate) || '',
    equityRiskPremium: formatNumber(back_end_inputs.equityRiskPremium) || '',
    cntryRiskPremium: formatNumber(back_end_inputs.cntryRiskPremium) || '',
    corpTaxRate: formatNumber(back_end_inputs.corpTaxRate) || '',
    perpetualGrowthRate: formatNumber(back_end_inputs.perpetualGrowthRate) || '',
    dcfWeightPercentage: formatNumber(back_end_inputs.dcfWeightPercentage) || '',
    waccDelta: formatNumber(back_end_inputs.waccDelta) || '',
    pptlDelta: formatNumber(back_end_inputs.pptlDelta) || ''
  });

  const calculateSales = useCallback((value) => {
    let valueType = 1;
    if(calculations.finance.valueType === 'Thousands'){
       valueType = 1000;
    }else if(calculations.finance.valueType === 'Millions'){
      valueType = 1000000;
    }else if(calculations.finance.valueType === 'Billions'){
      valueType = 1000000000;
    }else if(calculations.finance.valueType === 'Absolute'){
      valueType = 1;
    }

    return (calculations.finance.sales * valueType ) / value;
  }, [calculations.finance.sales]);

  const getDiscountFactor = useCallback((turnover) => {
    turnover = turnover/1000000;
    const turnoverFactorArray = data.businessDetails.turnoverFactor;
    const factor = turnoverFactorArray.find(factor => turnover >= factor.min && turnover < factor.max);
    return factor ? factor.discount_factor : '';
  }, [data.businessDetails.turnoverFactor]);

  const handleCurrencyConversionRateChange = useCallback((value) => {
    if (value.trim() === '') {
      setFormValues(prevValues => ({
        ...prevValues,
        currencyConversionRate: '',
        sales: '',
        cmpnyDiscFactorTurnover: '',
        cmpnyDiscFactor: ''
      }));
      return;
    }

    const turnover = calculateSales(parseFloat(value));
    const discountFactor = getDiscountFactor(turnover);

    // Retrieve yearInBusinessFactor and profitabilityFactor
    const yearInBusinessFactor = data.businessDetails.companyAgeDiscountFactor; // Assuming this value is provided in `data`
    const profitabilityFactor = data.businessDetails.earningTrendDiscountFactor; // Assuming this value is provided in `data`

    // Calculate the average
    const companyDiscountFactor = ((discountFactor + yearInBusinessFactor + profitabilityFactor) / 3).toFixed(2);

    setFormValues(prevValues => ({
      ...prevValues,
      currencyConversionRate: value,
      sales: turnover,
      cmpnyDiscFactorTurnover: discountFactor,
      cmpnyDiscFactor: companyDiscountFactor
    }));
  }, [calculateSales, getDiscountFactor, data.businessDetails.companyAgeDiscountFactor, data.businessDetails.earningTrendDiscountFactor]);

  useEffect(() => {
    if (businessDetails.currency === 'USD') {
      handleCurrencyConversionRateChange('1');
    }

  }, [businessDetails.currency, handleCurrencyConversionRateChange]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'currencyConversionRate') {
      handleCurrencyConversionRateChange(value);
    } else {
      setFormValues(prevValues => ({
        ...prevValues,
        [name]: value
      }));
    }

    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: '' // Clear the error for the specific field
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const newErrors = {};
    Object.keys(formValues).forEach(key => {
      if (formValues[key] === '') {
        newErrors[key] = 'This field is required';
      }
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      onFormSubmit(formValues);
    }
  };

  return (
    <div id="card_1" className="reportcol-lg-12 col-md-12">
      <h4 className="valuation-parameters-h4">Valuation Parameters</h4>
      <form onSubmit={handleSubmit}>
        <ParameterFormFields 
            calculations={calculations}
            businessDetails={businessDetails}
            formValues={formValues}
            handleInputChange={handleInputChange}
            errors={errors}
            save={save}
        />
      </form>
    </div>
  );
};

export default ParameterForm;
