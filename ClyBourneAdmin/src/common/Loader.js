import React, { useEffect } from 'react';
import { ColorRing } from 'react-loader-spinner';

const Loader = () => {
    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []); // Empty dependency array means this effect runs once when the component mounts

    return (
        <div style={{ textAlign: 'center', marginTop: '150px', marginBottom: '50px' }}>
            <ColorRing
                visible={true}
                height="80"
                width="80"
                ariaLabel="color-ring-loading"
                wrapperStyle={{}}
                wrapperClass="color-ring-wrapper"
                colors={['#4ea8f6']}
            />
        </div>
    );
};

export default Loader;
