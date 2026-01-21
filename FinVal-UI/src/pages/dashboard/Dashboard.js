import { useEffect, useState } from 'react';
import { fetchPlanData } from '../../services/PlanService';

const Dashboard = () => {
  const [planData, setPlanData] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const getPlanData = async () => {
      try {
        const plan = await fetchPlanData(token);
        setPlanData(plan);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    getPlanData();
  }, [token]);

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
};

export default Dashboard;
