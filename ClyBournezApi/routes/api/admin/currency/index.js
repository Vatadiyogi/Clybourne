const router = require('express').Router();
const CurrencyModel = require('../../../../models/Currency.model');
const { verifyAccessToken } = require("../../../../middleware/auth");
const { check, validationResult } = require("express-validator");

router.get('/', async (req, res) => {
    try {
        const currencies = await CurrencyModel.find();
        return res.status(200).json({'status': true, 'message': "Record has fetched", 'data': { currencies }});
    } catch (error) {
        return res.status(500).json({'status': false, 'message': error.message, 'data': []});
    }
});

router.get('/:currnecyId', async (req, res) => {
    try {
        const currnecy = await CurrencyModel.findById(req.params.currnecyId);
        return res.status(200).json({'status': true, 'message': "Record has fetched", 'data': { currnecy }});
    } catch (error) {
        return res.status(500).json({'status': false, 'message': error.message, 'data': []});
    }
})

router.post('/store', [
    check("name", "Currency name is required!").exists().not().isEmpty(),
    check("code", "Currency code is required!").exists().not().isEmpty(),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(500).json({status: false, message: errors.array()[0].msg, 'data': []});
        }

        const currnecy = new CurrencyModel({
            name: req.body.name,
            code: req.body.code,
            status: req.body.status !== undefined ? parseInt(req.body.status) : 1
        });

        await currnecy.save();
        return res.status(200).json({'status': true, 'message': "Currency record has been saved", 'data': { currnecy }});
    } catch (error) {
        return res.status(500).json({'status': false, 'message': error.message, 'data': []});
    }
});

router.put('/edit/:id', [
    check("name", "Currency name is required!").exists().not().isEmpty(),
    check("code", "Currency code is required!").exists().not().isEmpty(),
], async (req, res) => {    
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(500).json({status: false, message: errors.array()[0].msg, 'data': []});
        }

        const { id } = req.params;
        const updatedFields = {
            name: req.body.name,
            code: req.body.code,
            status: req.body.status !== undefined ? parseInt(req.body.status) : 1
        };

        const options = { new: true };
        const updatedCurrency = await CurrencyModel.findByIdAndUpdate(id, updatedFields, options);
        if (!updatedCurrency) {
            return res.status(500).json({'status': false, 'message': 'Currency record not found', 'data': []});
        }

        return res.status(200).json({'status': true, 'message': "Currency has been updated", 'data': { updatedCurrency }});
    } catch (error) {
        return res.status(500).json({'status': false, 'message': error.message, 'data': []});
    }
});

router.delete('/delete/:currencyId', async (req, res) => {
    try {
        const removedCurrency = await CurrencyModel.findByIdAndDelete(req.params.currencyId);
        if (!removedCurrency) {
            return res.status(404).json({ message: 'Currency record not found' });
        }

        return res.status(200).json({'status': true, 'message': "Currency has been deleted", 'data': []});
    } catch (error) {
        return res.status(500).json({'status': false, 'message': error.message, 'data': []});
    }
});

module.exports = router;