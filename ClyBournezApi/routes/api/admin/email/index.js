const router = require('express').Router();
const EmailTemplate = require('../../../../models/emailtemplates.model');
const { verifyAccessToken } = require("../../../../middleware/auth");
const { check, validationResult } = require("express-validator");

// Get all email templates
router.get('/', async (req, res) => {
    try {
        const templates = await EmailTemplate.find();
        return res.status(200).json({'status': true, 'message': "Record has fetched", 'data': { templates }});
    } catch (error) {
        return res.status(500).json({'status': false, 'message': error.message, 'data': []});
    }
});

// Get a specific email template
router.get('/:templateId', async (req, res) => {
    try {
        const template = await EmailTemplate.findById(req.params.templateId);
        return res.status(200).json({'status': true, 'message': "Record has fetched", 'data': { template }});
    } catch (error) {
        return res.status(500).json({'status': false, 'message': error.message, 'data': []});
    }
})

// Store an email template
router.post('/store', [
    check("title", "Template title is required!").exists().not().isEmpty(),
    check("subject", "Template subject is required!").exists().not().isEmpty(),
    check("description", "Template description is required!").exists().not().isEmpty(),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(500).json({status: false, message: errors.array()[0].msg, 'data': []});
        }

        // Fetch the maximum templateId from the collection
        const latestRecord = await EmailTemplate.find().sort({createdAt: -1}).limit(1);
        const newTemplateId = latestRecord.length > 0 ? (parseInt(latestRecord[0].templateId) + 1) : 1;

        const template = new EmailTemplate({
            title: req.body.title,
            subject: req.body.subject,
            description: req.body.description,
            status: req.body.status !== undefined ? parseInt(req.body.status) : 1,
            templateId: newTemplateId
        });

        await template.save();
        return res.status(200).json({'status': true, 'message': "Template has been saved", 'data': { template }});
    } catch (error) {
        return res.status(500).json({'status': false, 'message': error.message, 'data': []});
    }
});

router.put('/edit/:id', [
    check("title", "Template title is required!").exists().not().isEmpty(),
    check("subject", "Template subject is required!").exists().not().isEmpty(),
    check("description", "Template description is required!").exists().not().isEmpty(),
], async (req, res) => {    
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(500).json({status: false, message: errors.array()[0].msg, 'data': []});
        }

        const { id } = req.params;
        const updatedFields = {
            title: req.body.title,
            subject: req.body.subject,
            description: req.body.description,
            status: req.body.status !== undefined ? parseInt(req.body.status) : 1
        };

        const options = { new: true };
        const updatedTemplate = await EmailTemplate.findByIdAndUpdate(id, updatedFields, options);
        if (!updatedTemplate) {
            return res.status(500).json({'status': false, 'message': 'Email Template not found', 'data': []});
        }

        return res.status(200).json({'status': true, 'message': "Template has been updated", 'data': { updatedTemplate }});
    } catch (error) {
        return res.status(500).json({'status': false, 'message': error.message, 'data': []});
    }
});

router.delete('/delete/:templateId', async (req, res) => {
    try {
        const removedTemplate = await EmailTemplate.findByIdAndDelete(req.params.templateId);
        if (!removedTemplate) {
            return res.status(404).json({ message: 'Email Template not found' });
        }

        return res.status(200).json({'status': true, 'message': "Template has been deleted", 'data': []});
    } catch (error) {
        return res.status(500).json({'status': false, 'message': error.message, 'data': []});
    }
});

module.exports = router;