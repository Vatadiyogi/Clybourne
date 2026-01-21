const router = require('express').Router();
const IndustryModel = require('../../../../models/Industry.model');
const { verifyAccessToken } = require("../../../../middleware/auth");
const { check, validationResult } = require("express-validator");

router.get('/', async (req, res) => {
    try {
        const industries = await IndustryModel.find();
        return res.status(200).json({'status': true, 'message': "Record has fetched", 'data': { industries }});
    } catch (error) {
        return res.status(500).json({'status': false, 'message': error.message, 'data': []});
    }
});

router.get('/:industryId', async (req, res) => {
    try {
        const industry = await IndustryModel.findById(req.params.industryId);
        return res.status(200).json({'status': true, 'message': "Record has fetched", 'data': { industry }});
    } catch (error) {
        return res.status(500).json({'status': false, 'message': error.message, 'data': []});
    }
})

router.post('/store', [
    check("name", "Industry type is required!").exists().not().isEmpty(),
], verifyAccessToken, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(500).json({status: false, message: errors.array()[0].msg, 'data': []});
        }

        const industry = new IndustryModel({
            name: req.body.name,
            status: req.body.status !== undefined ? parseInt(req.body.status) : 1
        });

        await industry.save();
        return res.status(200).json({'status': true, 'message': "Industry type has been saved", 'data': { industry }});
    } catch (error) {
        return res.status(500).json({'status': false, 'message': error.message, 'data': []});
    }
});

router.put('/edit/:id', [
    check("name", "Industry name is required!").exists().not().isEmpty(),
], verifyAccessToken, async (req, res) => {    
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(500).json({status: false, message: errors.array()[0].msg, 'data': []});
        }

        const { id } = req.params;
        const updatedFields = {
            name: req.body.name,
            status: req.body.status !== undefined ? parseInt(req.body.status) : 1
        };

        const options = { new: true };
        const updatedIndustry = await IndustryModel.findByIdAndUpdate(id, updatedFields, options);
        if (!updatedIndustry) {
            return res.status(500).json({'status': false, 'message': 'Industry type not found', 'data': []});
        }

        return res.status(200).json({'status': true, 'message': "Industry type has been updated", 'data': { updatedIndustry }});
    } catch (error) {
        return res.status(500).json({'status': false, 'message': error.message, 'data': []});
    }
});

router.delete('/delete/:industryId', verifyAccessToken, async (req, res) => {
    try {
        const removedIndustryType = await IndustryModel.findByIdAndDelete(req.params.industryId);
        if (!removedIndustryType) {
            return res.status(404).json({ message: 'Industry type not found' });
        }

        return res.status(200).json({'status': true, 'message': "Industry type has been deleted", 'data': []});
    } catch (error) {
        return res.status(500).json({'status': false, 'message': error.message, 'data': []});
    }
});

module.exports = router;