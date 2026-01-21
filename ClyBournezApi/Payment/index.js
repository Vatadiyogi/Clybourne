const express = require('express');
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);
const PaymentModel = require('../models/transactions.model');
const PlanRecoredModel = require('../models/plan-record.model');
const UserModel = require('../models/user.model');

router.get('/payment/', async(req, res) => {
  const {planID}=req.query;
  console.log(planID)

const data={
  productDetails:{
    name:"Gold Membership",
    amount:20000,
    description:'HSUGKAHBJHBKNjksdbkjhadj' 
  },
  quantity:5
}

  const { productDetails, quantity } = data;

  const session = await stripe.checkout.sessions.create({
    line_items: [{
      price_data: {
        currency: 'inr',
        unit_amount: productDetails.amount,
        product_data: {
          name: productDetails.name,
          description: productDetails.description,
        },
      },
      quantity: quantity,
    }],
    
    mode: 'payment',
    success_url: 'http://localhost:5000/test/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://example.com/cancel',
  });
  res.redirect(303, session.url);
});

router.get('/cancel',async(req,res)=>{
  try{
    req.flash("error","Payment Cancelled");
    return res.redirect("/")
  }
  catch(err){
    console.log(err);
    }
})

router.get('/success',async(req,res)=>{
  const session_id=req.query;

  try{
    const session = await stripe.checkout.sessions.retrieve(session_id.session_id,
      {expand:[ "line_items"]}
      );
      if(!session){
        throw new Error("No such Session exists!");
        }
        let totalAmount=0;
        for (const item of session.line_items.data) {
          totalAmount +=item.quantity * item.price.unit_amount ;
          }
         
          if (session.payment_status === 'paid') {
            //here we gonna store the amount and paid status with user info 
            
            res.status(200).json({
              totalAmount:totalAmount /100,
              paymentStatus:"Paid",
              session
              
            });

            } else {
              res.send('Payment not made');
              }
              }catch(err){
                console.log(err);
                res.status(500).end();
                };
                

})

module.exports = router;
