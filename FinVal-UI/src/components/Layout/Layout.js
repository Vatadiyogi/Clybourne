import React, { useEffect, useState } from 'react';

const Layout = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCSS = async () => {
        await import('../../assets/css/vendors.min.css');
        await import('../../assets/css/icon.min.css');
        await import('../../assets/css/style.css');
        await import('../../assets/css/responsive.css');
        await import('../../assets/demos/finance/finance.css');
        await import('../../assets/demos/finance/mystyle.css');
        await import('../../assets/demos/finance/mystyle2.css');
        await import('../../assets/demos/finance/intlTelInput.css');
    };

    const loadJS = async () => {
    };


    const loadAssets = async () => {
      await loadCSS();
      await loadJS();
      setLoading(false);
    };

    loadAssets();
  }, []);

  if (loading) {
    return <div className="loading-spinner-container">
             <div className="loading-spinner"></div>
           </div>;
  }

  return <div>{children}</div>;
};

export default Layout;
