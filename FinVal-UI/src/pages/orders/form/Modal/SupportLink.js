import React, {useState, useEffect} from 'react';
import { fetchPlanData } from '../../../../services/PlanService';
import Support from './Support';
import NeedHelp from './NeedHelp';

const SupportLink = ({data}) => {
    const [planData, setPlanData] = useState(null);
    const token = localStorage.getItem('token');
    useEffect(() => {
        const getPlanData = async () => {
          try {
            const plan = await fetchPlanData(token);
            setPlanData(plan);
          } catch (error) {
    
          }
        };
        getPlanData();
      }, [token]);

    return (
        <>
            {planData ? (
            <>
                {planData.currentPlan === "BO" ? (
                  <NeedHelp data={planData} />
                ) : planData.currentPlan === "BOP" ? (
                   <Support documents={data} />
                ) : (
                  <></>
                )}
            </>
            ) : (
            <></>
            )}
        </>
    )
}

export default SupportLink;