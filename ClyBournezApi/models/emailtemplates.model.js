const mongoose = require("mongoose");
const EmailTemplate = new mongoose.Schema({
    templateId : {
      type : Number,
      required : true 
    },
    title: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      default:1
    },
  },
  {
    timestamps: true,
  });

const EmailTemplateModel = mongoose.model("EmailTemplate", EmailTemplate, "emailtemplates"); // Ensure collection name 'emailtemplates'
module.exports = EmailTemplateModel;