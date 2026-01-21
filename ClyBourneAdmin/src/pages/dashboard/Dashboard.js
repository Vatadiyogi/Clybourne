import React from 'react';
import CommonLayout from '../../common/CommonLayout';
import Widgets from './Widgets';

const Dashboard = () => (
    <CommonLayout>
    <div id="content" className="main-content">
        <div className="layout-px-spacing">
            <div className="middle-content container-xxl p-0">
                <div className="row layout-top-spacing">
                    {/* Add your main content here */}
                    <Widgets /> 
                </div>
            </div>
        </div>
    </div>
  </CommonLayout>  
);

export default Dashboard;
