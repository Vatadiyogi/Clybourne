import { useEffect } from 'react';

const Session = () => {
  useEffect(() => {
    // Delete 'orderId' from localStorage when the component is loaded
    // localStorage.removeItem('orderId');
    console.log(localStorage);
    console.log('orderId removed from localStorage');
  }, []); // The empty array ensures this runs only once when the component mounts

  return (
    <div>
      <h1>Session Cleared</h1>
    </div>
  );
};

export default Session;
