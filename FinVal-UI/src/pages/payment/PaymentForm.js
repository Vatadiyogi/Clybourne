import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { apiURL } from '../../config/Config';

const stripePromise = loadStripe('pk_test_51RpoTePjcaK1FKs1OEaDA43zko5NXGqzjoaP4dM3dMoIoKXabZ6cDUwjLTgS5G11tK6ITYi34Aie3VgoSLlrbHMz005m3lPUAv');
const PaymentForm = () => {
  const handleClick = async (event) => {
    const { data } = await axios.post(apiURL + '/stripe/create-checkout-session');
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({ sessionId: data.id });
    if (error) {
      console.error('Error redirecting to checkout:', error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20vh' }}>
      <button role="link" className="btn btn-large btn-round-edge bg-blue submit text-white w-100 fin-btn" onClick={handleClick}>
        Checkout
      </button>
    </div>
  );
};

export default PaymentForm;
