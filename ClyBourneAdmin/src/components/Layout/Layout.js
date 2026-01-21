// src/components/Layout.js

import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Load Bootstrap CSS globally
import '../../common/loader.css';

const Layout = ({ children, page }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCSS = async () => {
      if (page === 'login') {
        await import('../../assets/authentication/css/light/plugins.css');
        await import('../../assets/authentication/css/light/authentication/auth-boxed.css');
        await import('../../assets/authentication/css/light/loader.css');
      } else if(page === 'parameter') {
        await import('../../assets/authentication/css/light/plugins.css');
        await import('../../assets/authentication/css/light/loader.css');
        await import('../../assets/authentication/css/light/scrollspyNav.css');         
      }else if(page === 'holiday') {
        await import('../../assets/authentication/css/light/plugins.css');
        await import('../../assets/authentication/css/light/loader.css');
        await import('../../assets/authentication/css/light/scrollspyNav.css');             
        await import('../../assets/authentication/plugins/css/light/table/datatable/dt-global_style.css');
      } else {
        await import('../../assets/authentication/css/light/plugins.css');
        await import('../../assets/authentication/css/light/loader.css');
        await import('../../assets/authentication/plugins/src/apex/apexcharts.css');
        await import('../../assets/authentication/css/light/dashboard/dash_2.css');
        await import('../../assets/authentication/css/light/scrollspyNav.css');
      }
    };

    const loadJS = async () => {
      if (page === 'login') {
        await import('bootstrap/dist/js/bootstrap.bundle.min.js');
        await import('../../assets/authentication/loader.js');
      } else {
        await import('bootstrap/dist/js/bootstrap.bundle.min.js');
        await import('../../assets/authentication/loader.js');
      }
    };

    const loadAssets = async () => {
      await loadCSS();
      await loadJS();
      setLoading(false);
    };

    loadAssets();
  }, [page]);

  if (loading) {
    return <div className="loading-spinner-container">
             <div className="loading-spinner"></div>
           </div>;
  }

  return <div>{children}</div>;
};

export default Layout;
