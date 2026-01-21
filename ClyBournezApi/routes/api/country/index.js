const express = require('express');
const router = express.Router();

const Country = require('../../../models/Country.model');



router.get('/',async(req,res)=>{  
   try{
    const countries = await Country.find();
    res.status(200).json(countries);
   }
   catch(err){
    console.log(err);
  }
}
);

module.exports=router;

